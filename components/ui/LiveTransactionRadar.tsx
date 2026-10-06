'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, CheckCircle2, Radio, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveTransactionRadarProps {
  status: string; // 'PAYMENT_PENDING' | 'PAID' | 'UNDERPAID' | 'MANUAL_REVIEW' | 'EXPIRED'
  gateway: 'SEPAY' | 'LITECOIN';
  orderCode: string;
}

export default function LiveTransactionRadar({
  status,
  gateway,
  orderCode,
}: LiveTransactionRadarProps) {
  const previousStatus = useRef(status);

  // Trigger celebration explosion when transition to PAID occurs
  useEffect(() => {
    if (status === 'PAID' && previousStatus.current !== 'PAID') {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#10b981', '#a855f7', '#facc15'],
      });
    }
    previousStatus.current = status;
  }, [status]);

  const isPending = status === 'PAYMENT_PENDING';
  const isPaid = status === 'PAID';

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isPaid ? (
          <motion.div
            key="paid"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-[#070a14] border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              {/* Animated SVG Checkmark */}
              <div className="relative w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 text-emerald-400">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    className="animate-draw-check text-emerald-400"
                  />
                </svg>
                <div className="absolute -inset-1 rounded-xl bg-emerald-400/20 blur-sm animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-display">
                    Đã Khớp Giao Dịch Thành Công
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    PAID 100%
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 font-sans mt-0.5">
                  {gateway === 'SEPAY'
                    ? 'Hệ thống SePay IPN ghi nhận biến động số dư tức thì.'
                    : 'Litecoin Mempool Engine đã phát hiện giao dịch On-Chain.'}
                </p>
              </div>
            </div>

            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
          </motion.div>
        ) : isPending ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-[#090e1f]/80 border border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.12)] flex items-center justify-between gap-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Pulsating Radar Dot */}
              <div className="relative w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                <span className="absolute w-6 h-6 rounded-full bg-cyan-400/40 animate-ping" />
                <span className="relative w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,1)]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    RADAR LIVE SCANNER
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                    3s POLLING
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate mt-0.5 font-sans">
                  {gateway === 'SEPAY'
                    ? 'Đang lắng nghe biến động VietQR qua Webhook SePay...'
                    : 'Đang quét giao dịch Mempool / BlockCypher On-Chain...'}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400/80 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
