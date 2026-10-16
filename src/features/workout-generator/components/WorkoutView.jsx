"use client";

import { useState, useEffect, useCallback } from "react";
import { WeeklyScheduleCalendar } from "./WeeklyScheduleCalendar";
import { WorkoutGeneratorModal } from "./WorkoutGeneratorModal";
import { Dumbbell, Flame, Trophy } from "lucide-react";
import { getTodayDateString, formatNumber } from "@/lib/utils";

export function WorkoutView() {
  const [schedules, setSchedules] = useState([]);
  const [userWeight, setUserWeight] = useState(65);
  const [todayLogs, setTodayLogs] = useState([]);
  const [todayBurned, setTodayBurned] = useState(0);
  const [todayFatBurned, setTodayFatBurned] = useState(0);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const todayDate = getTodayDateString();

  const loadData = useCallback(async () => {
    try {
      // 1. Fetch Profile for weight
      const profRes = await fetch("/api/profile");
      if (profRes.ok) {
        const prof = await profRes.json();
        setUserWeight(prof.weight || 65);
      }

      // 2. Fetch Weekly Schedule
      const schedRes = await fetch("/api/workouts/schedule");
      if (schedRes.ok) {
        const sched = await schedRes.json();
        setSchedules(sched);
      }

      // 3. Fetch Today's Workout Logs
      const logsRes = await fetch(`/api/workouts?date=${todayDate}`);
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setTodayLogs(lData.logs || []);
        setTodayBurned(lData.summary?.totalBurned || 0);
        setTodayFatBurned(lData.summary?.totalFat || 0);
      }
    } catch (err) {
      console.error("Gagal memuat jadwal latihan:", err);
    }
  }, [todayDate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogExercise = async (payload) => {
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, date: todayDate }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completedNames = todayLogs.map((l) => l.exerciseName);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner Overview */}
      <div className="p-6 rounded-2xl glass-panel-glow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
            <Dumbbell className="w-3.5 h-3.5" /> Program Latihan Cerdas
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Workout Schedule & Fat Burn
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Latihan disesuaikan dengan berat badan Anda ({userWeight} kg) menggunakan standar nilai MET ilmiah.
          </p>
        </div>

        {/* Burned Stats Widget */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[130px]">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Kalori Terbakar</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xl font-extrabold text-orange-400">{formatNumber(todayBurned)}</span>
            </div>
            <span className="text-[10px] text-slate-500">kkal hari ini</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[130px]">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Estimasi Lemak</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Trophy className="w-4 h-4 text-teal-400" />
              <span className="text-xl font-extrabold text-teal-400">{todayFatBurned}g</span>
            </div>
            <span className="text-[10px] text-slate-500">lemak luruh</span>
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Schedule */}
      <WeeklyScheduleCalendar
        schedules={schedules}
        userWeight={userWeight}
        onLogExercise={handleLogExercise}
        completedExerciseNames={completedNames}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
      />

      {/* Generator Modal */}
      <WorkoutGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onScheduleGenerated={(newSchedules) => setSchedules(newSchedules)}
      />
    </div>
  );
}
