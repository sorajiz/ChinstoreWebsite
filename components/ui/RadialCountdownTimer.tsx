'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface RadialCountdownTimerProps {
  expiresAt?: string | Date | null;
  totalDurationSeconds?: number; // default 600 (10 mins)
  onExpire?: () => void;
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
}

export default function RadialCountdownTimer({
  expiresAt,
  totalDurationSeconds = 600,
  onExpire,
  size = 130,
  strokeWidth = 7,
  showLabels = true,
}: RadialCountdownTimerProps) {
  // Compute remaining seconds
  const calculateRemainingSeconds = () => {
    if (expiresAt) {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      return Math.min(diff, totalDurationSeconds);
    }
    return totalDurationSeconds;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateRemainingSeconds);

  useEffect(() => {
    // Initial sync
    setSecondsLeft(calculateRemainingSeconds());

    const interval = setInterval(() => {
      const remaining = calculateRemainingSeconds();
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, totalDurationSeconds]);

  // Calculations for SVG Ring
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, secondsLeft / totalDurationSeconds));
  const strokeDashoffset = circumference * (1 - progressRatio);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedMinutes = mins.toString().padStart(2, '0');
  const formattedSeconds = secs.toString().padStart(2, '0');

  // Dynamic theme state
  // > 5m: Cyan/Emerald, 2-5m: Cyan/Purple, < 2m: Orange/Rose pulse
  const colorState = useMemo(() => {
    if (secondsLeft <= 0) {
      return {
        stroke: '#f43f5e',
        glow: 'rgba(244, 63, 94, 0.4)',
        textColor: 'text-rose-400',
        badgeBg: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
        isWarning: true,
        label: 'ĐÃ HẾT HẠN',
      };
    }
    if (secondsLeft < 120) {
      return {
        stroke: '#fb923c',
        glow: 'rgba(251, 146, 60, 0.5)',
        textColor: 'text-orange-400',
        badgeBg: 'bg-orange-950/60 border-orange-500/40 text-orange-300',
        isWarning: true,
        label: 'SẮP HẾT HẠN',
      };
    }
    if (secondsLeft < 300) {
      return {
        stroke: '#06b6d4',
        glow: 'rgba(6, 182, 212, 0.4)',
        textColor: 'text-cyan-400',
        badgeBg: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
        isWarning: false,
        label: 'ĐANG GIỮ CHỖ',
      };
    }
    return {
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
      isWarning: false,
      label: 'KHÓA KHO HÀNG',
    };
  }, [secondsLeft]);

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`relative flex items-center justify-center ${
          colorState.isWarning ? 'animate-pulse' : ''
        }`}
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transition-all duration-500"
        >
          {/* Subtle Outer Halo Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Glowing Animated Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorState.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease, stroke 0.6s ease',
              filter: `drop-shadow(0 0 8px ${colorState.glow})`,
            }}
          />
        </svg>

        {/* Center Digital Flip Timer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center text-lg sm:text-xl font-black font-mono tracking-wider drop-shadow-md">
            {/* Minutes */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={formattedMinutes}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={colorState.textColor}
              >
                {formattedMinutes}
              </motion.span>
            </AnimatePresence>

            <span className="text-slate-400 px-0.5 animate-pulse">:</span>

            {/* Seconds */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={formattedSeconds}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={colorState.textColor}
              >
                {formattedSeconds}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span>Còn lại</span>
          </div>
        </div>
      </div>

      {/* Status Pill Badge */}
      {showLabels && (
        <div
          className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-sm ${colorState.badgeBg}`}
        >
          {colorState.isWarning ? (
            <AlertTriangle className="w-3 h-3 text-orange-400 animate-bounce" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
          <span>{colorState.label}</span>
        </div>
      )}
    </div>
  );
}
