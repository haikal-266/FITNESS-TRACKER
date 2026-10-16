"use client";

import { Flame } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function CalorieRingProgress({ consumed = 0, target = 2000, burned = 0 }) {
  const netCalories = Math.max(0, consumed - burned);
  const remaining = target - netCalories;
  const percentage = Math.min(100, Math.round((netCalories / target) * 100)) || 0;

  // SVG circular calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isOver = remaining < 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl glass-panel-glow">
      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress Bar */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="url(#calorie-gradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="calorie-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Flame className="w-5 h-5 text-emerald-400 mb-0.5 animate-pulse" />
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {formatNumber(consumed)}
          </span>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">kkal masuk</span>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="flex-1 w-full grid grid-cols-3 gap-3 text-center sm:text-left">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Target Harian</span>
          <span className="text-xl font-bold text-white block mt-0.5">{formatNumber(target)}</span>
          <span className="text-[10px] text-slate-500">kkal / hari</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Terbakar (Workout)</span>
          <span className="text-xl font-bold text-teal-400 block mt-0.5">-{formatNumber(burned)}</span>
          <span className="text-[10px] text-slate-500">kkal aktif</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Sisa Alokasi</span>
          <span
            className={`text-xl font-bold block mt-0.5 ${
              isOver ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {isOver ? `+${formatNumber(Math.abs(remaining))}` : formatNumber(remaining)}
          </span>
          <span className="text-[10px] text-slate-500">
            {isOver ? "Kelebihan kalori" : "kkal tersisa"}
          </span>
        </div>
      </div>
    </div>
  );
}
