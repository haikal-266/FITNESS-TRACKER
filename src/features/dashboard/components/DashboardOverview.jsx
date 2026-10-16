"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Dumbbell,
  Utensils,
  TrendingDown,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getTodayDateString, getIndonesianDayName, formatNumber } from "@/lib/utils";
import { hitungMenuHariIni } from "@/features/recipes/services/recipeService";

export function DashboardOverview() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentDayName, setCurrentDayName] = useState("");
  const [profile, setProfile] = useState(null);
  const [calorieSummary, setCalorieSummary] = useState({ totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [workoutBurned, setWorkoutBurned] = useState(0);
  const [workoutFat, setWorkoutFat] = useState(0);
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const today = getTodayDateString();
    const dayName = getIndonesianDayName(today);
    setCurrentDate(today);
    setCurrentDayName(dayName);

    async function loadDashboard() {
      try {
        // 1. Profile
        const pRes = await fetch("/api/profile");
        if (pRes.ok) setProfile(await pRes.json());

        // 2. Calories
        const cRes = await fetch(`/api/calories?date=${today}`);
        if (cRes.ok) {
          const cData = await cRes.json();
          setCalorieSummary(cData.summary || {});
          setRecentLogs(cData.logs || []);
        }

        // 3. Workouts
        const wRes = await fetch(`/api/workouts?date=${today}`);
        if (wRes.ok) {
          const wData = await wRes.json();
          setWorkoutBurned(wData.summary?.totalBurned || 0);
          setWorkoutFat(wData.summary?.totalFat || 0);
        }

        // 4. Weekly Schedules for today
        const sRes = await fetch("/api/workouts/schedule");
        if (sRes.ok) {
          const sData = await sRes.json();
          const todaySched = sData.find((s) => s.day === dayName);
          setTodaySchedule(todaySched || null);
        }

        // 5. Recipes
        const rRes = await fetch("/api/recipes");
        if (rRes.ok) {
          setRecipes(await rRes.json());
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    void loadDashboard();
  }, []);

  const targetCal = profile?.targetCalories || 2000;
  const netCalories = Math.max(0, calorieSummary.totalCalories - workoutBurned);
  const remaining = targetCal - netCalories;

  const todayRecipes = hitungMenuHariIni(recipes, currentDate);

  const todayExercises = todaySchedule
    ? typeof todaySchedule.exercises === "string"
      ? JSON.parse(todaySchedule.exercises || "[]")
      : todaySchedule.exercises || []
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-glow relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentDayName || "Hari Ini"}, {currentDate}
            </span>
            <Badge variant="sky">
              Target: {profile?.goal === "turun" ? "Defisit Kalori (Fat Loss)" : profile?.goal === "naik" ? "Surplus (Bulking)" : "Maintenance"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Selamat Datang,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {profile?.name || "Mahasiswa"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Pantau nutrisi harian, jadwal olahraga terprogram, dan menu diet sehat dalam satu platform terpadu.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Link href="/calories">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Catat Makanan
            </Button>
          </Link>
          <Link href="/workout">
            <Button variant="secondary" size="sm">
              <Dumbbell className="w-4 h-4 mr-1 text-emerald-400" /> Mulai Latihan
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Kalori Masuk */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Kalori Masuk</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatNumber(calorieSummary.totalCalories)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              dari target {formatNumber(targetCal)} kkal
            </span>
          </div>
        </div>

        {/* Card 2: Kalori Terbakar */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Terbakar (Workout)</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-400">
              {formatNumber(workoutBurned)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              setara ~{workoutFat}g lemak tubuh
            </span>
          </div>
        </div>

        {/* Card 3: Net Kalori */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Net Kalori</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-300">
              {formatNumber(netCalories)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              masuk dikurangi olahraga
            </span>
          </div>
        </div>

        {/* Card 4: Sisa Kalori */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sisa Kuota</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                remaining < 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {remaining < 0 ? `+${formatNumber(Math.abs(remaining))}` : formatNumber(remaining)}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              {remaining < 0 ? "melebihi batas harian" : "kkal tersisa untuk makan"}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Kolom: Latihan Hari Ini & Rekomendasi Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom 1: Workout of the Day */}
        <div className="rounded-2xl glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Latihan Hari Ini ({currentDayName || "Hari Ini"})
                </h3>
                <span className="text-xs text-slate-400">
                  {todaySchedule?.focus || "Jadwal Workout"}
                </span>
              </div>
            </div>

            <Link href="/workout">
              <Button size="sm" variant="ghost" className="text-xs text-emerald-400">
                Semua Jadwal <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {todaySchedule?.isRestDay ? (
            <div className="text-center py-6 text-slate-400 space-y-1">
              <p className="font-semibold text-sm text-slate-200">Hari Ini Rest Day!</p>
              <p className="text-xs">Fokuskan istirahat, hidrasi tubuh, dan relaksasi.</p>
            </div>
          ) : todayExercises.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Belum ada program latihan yang digenerate.
            </div>
          ) : (
            <div className="space-y-2">
              {todayExercises.slice(0, 3).map((ex, i) => (
                <div
                  key={ex.nama || i}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">{ex.nama}</span>
                    <span className="text-xs text-emerald-400">{ex.fokus}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-300">
                    {ex.set ? `${ex.set}x ` : ""}
                    {ex.nilai} {ex.tipe}
                  </span>
                </div>
              ))}
              {todayExercises.length > 3 && (
                <p className="text-center text-xs text-slate-500 pt-1">
                  +{todayExercises.length - 3} gerakan lainnya di modul latihan
                </p>
              )}
            </div>
          )}
        </div>

        {/* Kolom 2: Daily Diet Menu Recommendation */}
        <div className="rounded-2xl glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Menu Diet Sehat Hari Ini
                </h3>
                <span className="text-xs text-slate-400">Rotasi menu seimbang otomatis</span>
              </div>
            </div>

            <Link href="/recipes">
              <Button size="sm" variant="ghost" className="text-xs text-orange-400">
                Lihat Resep <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-2.5">
            {todayRecipes.map((item) => (
              <div
                key={item.kategori}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {item.kategori}
                  </span>
                  <span className="text-sm font-semibold text-slate-200">{item.resep.nama}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 block">
                    {item.resep.kalori} kkal
                  </span>
                  <span className="text-[10px] text-slate-500">{item.resep.waktu} mnt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Makanan yang Baru Dicatat Hari Ini */}
      <div className="rounded-2xl glass-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Jurnal Makanan Tercatat Hari Ini ({recentLogs.length} item)
          </h3>
          <Link href="/calories">
            <Button size="sm" variant="outline" className="text-xs">
              Buka Tracker Kalori
            </Button>
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            Belum ada makanan dicatat hari ini. Klik "Catat Makanan" untuk mulai mencatat.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200 block truncate max-w-[150px]">
                    {log.foodName}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {log.mealType} • {log.portion} {log.unit}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {log.calories} kkal
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
