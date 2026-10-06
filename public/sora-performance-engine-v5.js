/**
 * ============================================================
 * SORA PERFORMANCE ENGINE v5.0
 * Single-file Safe Adaptive Performance Engine
 * ============================================================
 *
 * DROP-IN:
 *   <script>
 *   window.SORA_PERF_CONFIG = {
 *     targetFPS: 60,
 *     profile: "auto", // auto | quality | balanced | performance
 *     debug: false,
 *     hud: false
 *   };
 *   </script>
 *   <script src="/sora-performance-engine-v5.js" defer></script>
 *
 * SAFE BY DEFAULT
 * ------------------------------------------------------------
 * - Does NOT remove DOM nodes.
 * - Does NOT rewrite your layout.
 * - Does NOT replace fetch/XHR.
 * - Does NOT monkey-patch requestAnimationFrame.
 * - Does NOT disable all animations globally.
 * - Does NOT modify React/Vue event handlers.
 * - Does NOT touch unmarked effects.
 *
 * OPT-IN ATTRIBUTES
 * ------------------------------------------------------------
 * data-sora-opt="glass"
 * data-sora-opt="heavy"
 * data-sora-opt="particle"
 * data-sora-opt="animation"
 * data-sora-opt="media"
 * data-sora-opt="content"
 *
 * PROTECTION
 * ------------------------------------------------------------
 * data-sora-critical
 *
 * API
 * ------------------------------------------------------------
 * SoraPerformance.state
 * SoraPerformance.getRecommendedDPR()
 * SoraPerformance.createAdaptiveLoop(fn, options)
 * SoraPerformance.onChange(fn)
 * SoraPerformance.setProfile("auto"|"quality"|"balanced"|"performance")
 * SoraPerformance.setLevel(0..3)
 * SoraPerformance.refresh()
 * SoraPerformance.pause()
 * SoraPerformance.resume()
 * SoraPerformance.destroy()
 */

(() => {
  "use strict";

  if (typeof window === "undefined") return;
  if (window.__SORA_PERFORMANCE_V5__) return;
  window.__SORA_PERFORMANCE_V5__ = true;

  // ============================================================
  // CONFIG
  // ============================================================
  const DEFAULTS = {
    targetFPS: 60,
    minFPS: 30,
    profile: "auto",
    debug: false,
    hud: false,

    safeMode: true,

    fpsWindowMs: 850,
    evaluateEveryMs: 1600,
    recoveryDelayMs: 9000,
    downgradeDelayMs: 800,
    smoothing: 0.20,

    balancedRatio: 0.90,
    lowRatio: 0.74,
    emergencyRatio: 0.54,
    recoverRatio: 0.95,

    observeLongTasks: true,
    longTaskWindowMs: 5000,
    longTaskBalancedMs: 120,
    longTaskLowMs: 260,
    longTaskEmergencyMs: 520,

    observeEventLoopLag: true,
    lagSampleMs: 1000,
    lagBalancedMs: 35,
    lagLowMs: 85,
    lagEmergencyMs: 150,

    observeInteractions: true,
    interactionBoostMs: 180,
    scrollBoostMs: 150,

    autoPauseOffscreen: true,
    autoOptimizeMarkedMedia: true,
    autoOptimizeMarkedContent: true,

    dprQuality: 3,
    dprBalanced: 2,
    dprLow: 1.5,
    dprEmergency: 1,

    adaptiveFPSQuality: 120,
    adaptiveFPSBalanced: 60,
    adaptiveFPSLow: 45,
    adaptiveFPSEmergency: 30
  };

  const CONFIG = Object.assign({}, DEFAULTS, window.SORA_PERF_CONFIG || {});
  const LEVEL_NAMES = ["quality", "balanced", "low", "emergency"];

  // ============================================================
  // STATE
  // ============================================================
  const state = {
    version: "5.0.0",
    running: true,

    level: 0,
    levelName: "quality",
    profile: CONFIG.profile,

    fpsInstant: CONFIG.targetFPS,
    fps: CONFIG.targetFPS,
    frameTimeMs: 1000 / CONFIG.targetFPS,

    longTaskMs: 0,
    longTaskCount: 0,
    eventLoopLagMs: 0,

    hidden: document.hidden,
    interacting: false,
    scrolling: false,

    lastChangeAt: performance.now(),
    stableSince: performance.now(),

    hardware: {
      cores: navigator.hardwareConcurrency || null,
      memoryGB: navigator.deviceMemory || null,
      touchPoints: navigator.maxTouchPoints || 0,
      mobile:
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints || 0) > 1,
      saveData: !!navigator.connection?.saveData,
      effectiveType: navigator.connection?.effectiveType || null,
      reducedMotion:
        !!window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }
  };

  const listeners = new Set();

  const log = (...args) => {
    if (CONFIG.debug) {
      console.log("%c[SORA PERF v5]", "font-weight:700", ...args);
    }
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // ============================================================
  // INLINE CSS
  // ============================================================
  const STYLE_ID = "sora-performance-engine-v5-style";
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    :root {
      --sora-perf-level: 0;
      --sora-perf-motion: 1;
      --sora-perf-fx: 1;
    }

    .sora-offscreen[data-sora-opt="animation"],
    .sora-offscreen[data-sora-opt="particle"] {
      animation-play-state: paused !important;
    }

    .sora-content-auto[data-sora-opt="content"] {
      content-visibility: auto;
      contain-intrinsic-size: auto 600px;
    }

    html.sora-perf-balanced {
      --sora-perf-motion: .9;
      --sora-perf-fx: .9;
    }

    html.sora-perf-balanced [data-sora-opt="heavy"]:not([data-sora-critical]),
    html.sora-perf-balanced [data-sora-opt="glass"]:not([data-sora-critical]) {
      will-change: auto !important;
    }

    html.sora-perf-low {
      --sora-perf-motion: .72;
      --sora-perf-fx: .65;
    }

    html.sora-perf-low [data-sora-opt="glass"]:not([data-sora-critical]) {
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
    }

    html.sora-perf-low [data-sora-opt="heavy"]:not([data-sora-critical]) {
      filter: none !important;
      box-shadow: none !important;
      text-shadow: none !important;
      will-change: auto !important;
    }

    html.sora-perf-low [data-sora-opt="particle"]:not([data-sora-critical]) {
      opacity: .24 !important;
      animation-play-state: paused !important;
      pointer-events: none !important;
    }

    html.sora-perf-emergency {
      --sora-perf-motion: .45;
      --sora-perf-fx: .25;
    }

    html.sora-perf-emergency [data-sora-opt="glass"]:not([data-sora-critical]),
    html.sora-perf-emergency [data-sora-opt="heavy"]:not([data-sora-critical]) {
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
      filter: none !important;
      box-shadow: none !important;
      text-shadow: none !important;
      will-change: auto !important;
    }

    html.sora-perf-emergency [data-sora-opt="particle"]:not([data-sora-critical]) {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      animation-play-state: paused !important;
    }

    html.sora-perf-emergency [data-sora-opt="animation"]:not([data-sora-critical]) {
      animation-duration: .001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .08s !important;
    }

    html.sora-perf-interacting [data-sora-opt="heavy"]:not([data-sora-critical]),
    html.sora-perf-scrolling [data-sora-opt="heavy"]:not([data-sora-critical]) {
      will-change: auto !important;
    }

    html.sora-perf-low.sora-perf-interacting [data-sora-opt="glass"]:not([data-sora-critical]),
    html.sora-perf-low.sora-perf-scrolling [data-sora-opt="glass"]:not([data-sora-critical]),
    html.sora-perf-emergency.sora-perf-interacting [data-sora-opt="glass"]:not([data-sora-critical]),
    html.sora-perf-emergency.sora-perf-scrolling [data-sora-opt="glass"]:not([data-sora-critical]) {
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
    }

    #sora-performance-hud {
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 2147483647;
      min-width: 120px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 13px;
      background: rgba(13,13,17,.86);
      color: rgba(255,255,255,.96);
      box-shadow: 0 10px 30px rgba(0,0,0,.24);
      font: 700 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      white-space: pre;
      pointer-events: none;
      user-select: none;
    }
  `;
  document.head.appendChild(style);

  // ============================================================
  // HELPERS
  // ============================================================
  function getState() {
    return {
      version: state.version,
      running: state.running,
      level: state.level,
      levelName: state.levelName,
      profile: state.profile,
      fps: Math.round(state.fps),
      fpsInstant: Math.round(state.fpsInstant),
      frameTimeMs: Number(state.frameTimeMs.toFixed(2)),
      longTaskMs: Math.round(state.longTaskMs),
      longTaskCount: state.longTaskCount,
      eventLoopLagMs: Math.round(state.eventLoopLagMs),
      hidden: state.hidden,
      interacting: state.interacting,
      scrolling: state.scrolling,
      recommendedDPR: getRecommendedDPR(),
      hardware: { ...state.hardware }
    };
  }

  function emit(reason) {
    const snapshot = getState();

    for (const fn of listeners) {
      try {
        fn(snapshot, reason);
      } catch (err) {
        if (CONFIG.debug) console.warn("[SORA PERF listener]", err);
      }
    }

    window.dispatchEvent(
      new CustomEvent("sora:performancechange", {
        detail: { ...snapshot, reason }
      })
    );
  }

  function applyRootState() {
    const root = document.documentElement;

    for (const name of LEVEL_NAMES) {
      root.classList.remove(`sora-perf-${name}`);
    }

    root.classList.add(`sora-perf-${state.levelName}`);
    root.dataset.soraPerfLevel = String(state.level);
    root.dataset.soraPerfMode = state.levelName;
    root.style.setProperty("--sora-perf-level", String(state.level));
  }

  function setLevel(next, reason = "manual") {
    next = clamp(Number(next) || 0, 0, 3);

    if (next === state.level) return false;

    state.level = next;
    state.levelName = LEVEL_NAMES[next];
    state.lastChangeAt = performance.now();

    applyRootState();
    emit(reason);

    log(
      `mode=${state.levelName}`,
      `fps=${Math.round(state.fps)}`,
      `long=${Math.round(state.longTaskMs)}`,
      `lag=${Math.round(state.eventLoopLagMs)}`,
      reason
    );

    return true;
  }

  // ============================================================
  // HARDWARE FLOOR
  // ============================================================
  function getHardwareFloorLevel() {
    const h = state.hardware;

    if (state.profile === "quality") return 0;
    if (state.profile === "balanced") return 1;
    if (state.profile === "performance") return 2;

    let floor = 0;

    if (h.reducedMotion || h.saveData) {
      floor = Math.max(floor, 1);
    }

    if (
      (typeof h.cores === "number" && h.cores <= 2) ||
      (typeof h.memoryGB === "number" && h.memoryGB <= 2)
    ) {
      floor = Math.max(floor, 2);
    } else if (
      (typeof h.cores === "number" && h.cores <= 4) ||
      (typeof h.memoryGB === "number" && h.memoryGB <= 4)
    ) {
      floor = Math.max(floor, 1);
    }

    return floor;
  }

  // ============================================================
  // FPS MONITOR
  // ============================================================
  let rafId = 0;
  let frameCount = 0;
  let fpsStart = performance.now();
  let lastFrame = performance.now();

  function frameLoop(now) {
    if (!state.running) return;

    if (state.hidden) {
      frameCount = 0;
      fpsStart = now;
      lastFrame = now;
      rafId = requestAnimationFrame(frameLoop);
      return;
    }

    const delta = now - lastFrame;
    lastFrame = now;

    if (delta > 0 && delta < 500) {
      state.frameTimeMs =
        state.frameTimeMs * 0.82 + delta * 0.18;
    }

    frameCount++;

    const elapsed = now - fpsStart;

    if (elapsed >= CONFIG.fpsWindowMs) {
      const measured = (frameCount * 1000) / elapsed;

      state.fpsInstant = measured;
      state.fps =
        state.fps * (1 - CONFIG.smoothing) +
        measured * CONFIG.smoothing;

      frameCount = 0;
      fpsStart = now;
    }

    rafId = requestAnimationFrame(frameLoop);
  }

  // ============================================================
  // LONG TASK MONITOR
  // ============================================================
  const longTasks = [];
  let longTaskObserver = null;

  function pruneLongTasks(now = performance.now()) {
    while (
      longTasks.length &&
      now - longTasks[0].time > CONFIG.longTaskWindowMs
    ) {
      longTasks.shift();
    }

    let total = 0;
    for (const item of longTasks) total += item.duration;

    state.longTaskMs = total;
    state.longTaskCount = longTasks.length;
  }

  if (CONFIG.observeLongTasks && "PerformanceObserver" in window) {
    try {
      longTaskObserver = new PerformanceObserver(list => {
        const now = performance.now();

        for (const entry of list.getEntries()) {
          if (entry.duration >= 40) {
            longTasks.push({
              time: now,
              duration: entry.duration
            });
          }
        }

        pruneLongTasks(now);
      });

      longTaskObserver.observe({ entryTypes: ["longtask"] });
    } catch (_) {
      longTaskObserver = null;
    }
  }

  // ============================================================
  // EVENT LOOP LAG
  // ============================================================
  let lagTimer = 0;
  let lagExpected = performance.now() + CONFIG.lagSampleMs;

  function lagLoop() {
    if (!state.running) return;

    const now = performance.now();
    const lag = Math.max(0, now - lagExpected);

    state.eventLoopLagMs =
      state.eventLoopLagMs * 0.72 + lag * 0.28;

    lagExpected = now + CONFIG.lagSampleMs;
    lagTimer = setTimeout(lagLoop, CONFIG.lagSampleMs);
  }

  if (CONFIG.observeEventLoopLag) {
    lagTimer = setTimeout(lagLoop, CONFIG.lagSampleMs);
  }

  // ============================================================
  // INTERACTION / SCROLL BOOST
  // ============================================================
  let interactionTimer = 0;
  let scrollTimer = 0;

  function markInteracting() {
    if (!CONFIG.observeInteractions) return;

    state.interacting = true;
    document.documentElement.classList.add("sora-perf-interacting");

    clearTimeout(interactionTimer);
    interactionTimer = setTimeout(() => {
      state.interacting = false;
      document.documentElement.classList.remove("sora-perf-interacting");
    }, CONFIG.interactionBoostMs);
  }

  function markScrolling() {
    state.scrolling = true;
    document.documentElement.classList.add("sora-perf-scrolling");

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      state.scrolling = false;
      document.documentElement.classList.remove("sora-perf-scrolling");
    }, CONFIG.scrollBoostMs);
  }

  if (CONFIG.observeInteractions) {
    window.addEventListener("pointerdown", markInteracting, { passive: true });
    window.addEventListener("keydown", markInteracting, { passive: true });
    window.addEventListener("touchstart", markInteracting, { passive: true });
  }

  window.addEventListener("scroll", markScrolling, { passive: true });
  window.addEventListener("wheel", markScrolling, { passive: true });
  window.addEventListener("touchmove", markScrolling, { passive: true });

  // ============================================================
  // ADAPTIVE CONTROLLER
  // ============================================================
  function desiredLevel() {
    if (state.profile === "quality") return 0;
    if (state.profile === "balanced") return 1;
    if (state.profile === "performance") return 2;

    const target = Math.max(30, CONFIG.targetFPS);
    const ratio = state.fps / target;
    const floor = getHardwareFloorLevel();

    let desired = floor;

    if (
      ratio < CONFIG.emergencyRatio ||
      state.longTaskMs >= CONFIG.longTaskEmergencyMs ||
      state.eventLoopLagMs >= CONFIG.lagEmergencyMs
    ) {
      desired = Math.max(desired, 3);
    } else if (
      ratio < CONFIG.lowRatio ||
      state.longTaskMs >= CONFIG.longTaskLowMs ||
      state.eventLoopLagMs >= CONFIG.lagLowMs
    ) {
      desired = Math.max(desired, 2);
    } else if (
      ratio < CONFIG.balancedRatio ||
      state.longTaskMs >= CONFIG.longTaskBalancedMs ||
      state.eventLoopLagMs >= CONFIG.lagBalancedMs
    ) {
      desired = Math.max(desired, 1);
    }

    return desired;
  }

  let evaluateTimer = 0;

  function evaluate() {
    if (!state.running || state.hidden) return;

    pruneLongTasks();

    const now = performance.now();
    const desired = desiredLevel();

    if (desired > state.level) {
      if (now - state.lastChangeAt >= CONFIG.downgradeDelayMs) {
        setLevel(desired, "pressure");
        state.stableSince = now;
      }
      return;
    }

    if (desired < state.level) {
      const healthy =
        state.fps >= CONFIG.targetFPS * CONFIG.recoverRatio &&
        state.longTaskMs < CONFIG.longTaskBalancedMs * 0.45 &&
        state.eventLoopLagMs < CONFIG.lagBalancedMs * 0.45;

      if (!healthy) {
        state.stableSince = now;
        return;
      }

      if (now - state.stableSince >= CONFIG.recoveryDelayMs) {
        setLevel(state.level - 1, "recovered");
        state.stableSince = now;
      }

      return;
    }

    const healthy =
      state.fps >= CONFIG.targetFPS * CONFIG.recoverRatio &&
      state.longTaskMs < CONFIG.longTaskBalancedMs * 0.45 &&
      state.eventLoopLagMs < CONFIG.lagBalancedMs * 0.45;

    if (!healthy) state.stableSince = now;
  }

  evaluateTimer = setInterval(evaluate, CONFIG.evaluateEveryMs);

  // ============================================================
  // OPT-IN MEDIA / CONTENT
  // ============================================================
  function optimizeMarkedMedia(root = document) {
    if (!CONFIG.autoOptimizeMarkedMedia) return;

    const list = root.querySelectorAll?.('[data-sora-opt="media"]');

    list?.forEach(el => {
      if (el.hasAttribute("data-sora-critical")) return;

      if (el instanceof HTMLImageElement) {
        if (!el.hasAttribute("loading")) el.loading = "lazy";
        if (!el.hasAttribute("decoding")) el.decoding = "async";
      }

      if (el instanceof HTMLVideoElement) {
        if (!el.hasAttribute("preload")) el.preload = "metadata";
        el.playsInline = true;
      }

      if (el instanceof HTMLIFrameElement) {
        if (!el.hasAttribute("loading")) el.loading = "lazy";
      }
    });
  }

  function optimizeMarkedContent(root = document) {
    if (!CONFIG.autoOptimizeMarkedContent) return;

    root
      .querySelectorAll?.('[data-sora-opt="content"]')
      .forEach(el => {
        if (!el.hasAttribute("data-sora-critical")) {
          el.classList.add("sora-content-auto");
        }
      });
  }

  // ============================================================
  // OFFSCREEN OBSERVER
  // ============================================================
  let intersectionObserver = null;

  if (CONFIG.autoPauseOffscreen && "IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const el = entry.target;

          if (el.hasAttribute("data-sora-critical")) continue;

          if (entry.isIntersecting) {
            el.classList.remove("sora-offscreen");

            if (
              el instanceof HTMLVideoElement &&
              el.dataset.soraWasPlaying === "1"
            ) {
              el.play().catch(() => {});
              delete el.dataset.soraWasPlaying;
            }
          } else {
            el.classList.add("sora-offscreen");

            if (
              el instanceof HTMLVideoElement &&
              el.dataset.soraOpt === "media" &&
              !el.paused
            ) {
              el.dataset.soraWasPlaying = "1";
              el.pause();
            }
          }
        }
      },
      { rootMargin: "180px 0px", threshold: 0.01 }
    );
  }

  function observeMarked(root = document) {
    if (!intersectionObserver) return;

    const selector =
      '[data-sora-opt="animation"],' +
      '[data-sora-opt="particle"],' +
      '[data-sora-opt="media"]';

    root.querySelectorAll?.(selector).forEach(el => {
      intersectionObserver.observe(el);
    });

    if (root instanceof Element && root.matches?.(selector)) {
      intersectionObserver.observe(root);
    }
  }

  // ============================================================
  // MUTATION OBSERVER
  // ============================================================
  const mutationObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;

        observeMarked(node);
        optimizeMarkedMedia(node);
        optimizeMarkedContent(node);
      }
    }
  });

  // ============================================================
  // VISIBILITY
  // ============================================================
  document.addEventListener("visibilitychange", () => {
    state.hidden = document.hidden;

    window.dispatchEvent(
      new CustomEvent("sora:visibilitychange", {
        detail: { hidden: state.hidden }
      })
    );
  });

  // ============================================================
  // DPR
  // ============================================================
  function getRecommendedDPR() {
    const native = window.devicePixelRatio || 1;

    let cap = CONFIG.dprQuality;

    if (state.level === 1) cap = CONFIG.dprBalanced;
    if (state.level === 2) cap = CONFIG.dprLow;
    if (state.level === 3) cap = CONFIG.dprEmergency;

    return Math.max(1, Math.min(native, cap));
  }

  // ============================================================
  // ADAPTIVE RAF LOOP
  // ============================================================
  function createAdaptiveLoop(callback, options = {}) {
    if (typeof callback !== "function") {
      throw new TypeError("callback must be a function");
    }

    const requestedFPS =
      Number(options.targetFPS) > 0
        ? Number(options.targetFPS)
        : CONFIG.targetFPS;

    let stopped = false;
    let paused = false;
    let localRaf = 0;
    let last = performance.now();

    function currentCap() {
      if (state.level === 0) {
        return Math.min(requestedFPS, CONFIG.adaptiveFPSQuality);
      }
      if (state.level === 1) {
        return Math.min(requestedFPS, CONFIG.adaptiveFPSBalanced);
      }
      if (state.level === 2) {
        return Math.min(requestedFPS, CONFIG.adaptiveFPSLow);
      }
      return Math.min(requestedFPS, CONFIG.adaptiveFPSEmergency);
    }

    function tick(now) {
      if (stopped) return;

      if (paused || state.hidden || !state.running) {
        last = now;
        localRaf = requestAnimationFrame(tick);
        return;
      }

      const fpsCap = Math.max(CONFIG.minFPS, currentCap());
      const interval = 1000 / fpsCap;
      const elapsed = now - last;

      if (elapsed >= interval) {
        const delta = elapsed;
        last = now - (elapsed % interval);

        callback({
          now,
          delta,
          fps: state.fps,
          level: state.level,
          levelName: state.levelName,
          dpr: getRecommendedDPR()
        });
      }

      localRaf = requestAnimationFrame(tick);
    }

    localRaf = requestAnimationFrame(tick);

    return {
      stop() {
        stopped = true;
        cancelAnimationFrame(localRaf);
      },
      pause() {
        paused = true;
      },
      resume() {
        paused = false;
        last = performance.now();
      }
    };
  }

  // ============================================================
  // HUD
  // ============================================================
  let hud = null;
  let hudTimer = 0;

  function createHUD() {
    if (!CONFIG.hud || hud) return;

    hud = document.createElement("div");
    hud.id = "sora-performance-hud";
    hud.setAttribute("aria-hidden", "true");
    document.body.appendChild(hud);

    const update = () => {
      if (!hud) return;

      hud.textContent =
        `SORA PERF v5\n` +
        `FPS  ${Math.round(state.fps)}\n` +
        `MODE ${state.levelName.toUpperCase()}\n` +
        `LONG ${Math.round(state.longTaskMs)}ms\n` +
        `LAG  ${Math.round(state.eventLoopLagMs)}ms\n` +
        `DPR  ${getRecommendedDPR().toFixed(2)}`;
    };

    update();
    hudTimer = setInterval(update, 500);
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  window.SoraPerformance = {
    version: "5.0.0",

    get state() {
      return getState();
    },

    onChange(fn) {
      if (typeof fn !== "function") return () => {};
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    getRecommendedDPR,

    createAdaptiveLoop,

    setProfile(profile) {
      const allowed = ["auto", "quality", "balanced", "performance"];
      if (!allowed.includes(profile)) return false;

      state.profile = profile;
      state.stableSince = performance.now();
      evaluate();
      emit("profile");
      return true;
    },

    setLevel(level) {
      return setLevel(level, "manual");
    },

    refresh(root = document) {
      observeMarked(root);
      optimizeMarkedMedia(root);
      optimizeMarkedContent(root);
    },

    pause() {
      if (!state.running) return;
      state.running = false;
      emit("paused");
    },

    resume() {
      if (state.running) return;

      state.running = true;
      state.stableSince = performance.now();
      fpsStart = performance.now();
      lastFrame = performance.now();
      lagExpected = performance.now() + CONFIG.lagSampleMs;

      rafId = requestAnimationFrame(frameLoop);

      if (CONFIG.observeEventLoopLag) {
        clearTimeout(lagTimer);
        lagTimer = setTimeout(lagLoop, CONFIG.lagSampleMs);
      }

      emit("resumed");
    },

    destroy() {
      state.running = false;

      cancelAnimationFrame(rafId);
      clearInterval(evaluateTimer);
      clearTimeout(lagTimer);
      clearInterval(hudTimer);
      clearTimeout(interactionTimer);
      clearTimeout(scrollTimer);

      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
      longTaskObserver?.disconnect();

      hud?.remove();
      style.remove();

      const root = document.documentElement;

      for (const name of LEVEL_NAMES) {
        root.classList.remove(`sora-perf-${name}`);
      }

      root.classList.remove(
        "sora-perf-interacting",
        "sora-perf-scrolling"
      );

      root.removeAttribute("data-sora-perf-level");
      root.removeAttribute("data-sora-perf-mode");
      root.style.removeProperty("--sora-perf-level");

      document
        .querySelectorAll(".sora-offscreen, .sora-content-auto")
        .forEach(el => {
          el.classList.remove("sora-offscreen", "sora-content-auto");
        });

      listeners.clear();

      delete window.__SORA_PERFORMANCE_V5__;
      delete window.SoraPerformance;
    }
  };

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    const floor = getHardwareFloorLevel();

    state.level = floor;
    state.levelName = LEVEL_NAMES[floor];
    state.stableSince = performance.now();
    state.lastChangeAt = performance.now();

    applyRootState();

    observeMarked(document);
    optimizeMarkedMedia(document);
    optimizeMarkedContent(document);

    mutationObserver.observe(document.documentElement, {
      subtree: true,
      childList: true
    });

    rafId = requestAnimationFrame(frameLoop);
    createHUD();

    emit("ready");
    log("ready", getState());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
