"use client";

import { useState, useEffect, useCallback } from "react";
import { CalorieRingProgress } from "./CalorieRingProgress";
import { MacroNutrientBar } from "./MacroNutrientBar";
import { FoodLogList } from "./FoodLogList";
import { AddFoodModal } from "./AddFoodModal";
import { Button } from "@/components/ui/Button";
import { Calendar, ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { getTodayDateString, getIndonesianDayName } from "@/lib/utils";
import { hitungMakronutrisi } from "../utils/calorieMath";

export function CalorieTrackerView() {
  const [currentDate, setCurrentDate] = useState("");
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
  const [profile, setProfile] = useState({ targetCalories: 2000, goal: "turun" });
  const [workoutBurned, setWorkoutBurned] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState("sarapan");

  // Load profile & data for date
  const loadData = useCallback(async (date) => {
    if (!date) return;
    try {
      // 1. Fetch Profile
      const profRes = await fetch("/api/profile");
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile(profData);
      }

      // 2. Fetch Food Logs for Date
      const calRes = await fetch(`/api/calories?date=${date}`);
      if (calRes.ok) {
        const calData = await calRes.json();
        setLogs(calData.logs || []);
        setSummary(calData.summary || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
      }

      // 3. Fetch Workout Burned for Date
      const workRes = await fetch(`/api/workouts?date=${date}`);
      if (workRes.ok) {
        const workData = await workRes.json();
        setWorkoutBurned(workData.summary?.totalBurned || 0);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  }, []);

  useEffect(() => {
    const today = getTodayDateString();
    setCurrentDate(today);
    void loadData(today);
  }, [loadData]);

  const handlePrevDay = () => {
    const d = new Date(currentDate || getTodayDateString());
    d.setDate(d.getDate() - 1);
    const newDate = d.toISOString().split("T")[0];
    setCurrentDate(newDate);
    void loadData(newDate);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate || getTodayDateString());
    d.setDate(d.getDate() + 1);
    const newDate = d.toISOString().split("T")[0];
    setCurrentDate(newDate);
    void loadData(newDate);
  };

  const handleAddFood = async (payload) => {
    try {
      const res = await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await loadData(currentDate);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      const res = await fetch(`/api/calories/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadData(currentDate);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddModal = (mealType = "sarapan") => {
    setActiveMealType(mealType);
    setIsAddModalOpen(true);
  };

  // Hitung target makronutrisi dari target kalori profil
  const targetMacros = hitungMakronutrisi(profile.targetCalories || 2000, profile.goal || "turun");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Date Navigator Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {currentDate ? `${getIndonesianDayName(currentDate)}, ${currentDate}` : "Memuat..."}
            </h2>
            <span className="text-xs text-slate-400">Jurnal Makanan & Asupan Nutrisi Harian</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const today = getTodayDateString();
              setCurrentDate(today);
              void loadData(today);
            }}
            className="text-xs font-semibold"
          >
            Hari Ini
          </Button>
          <Button variant="secondary" size="sm" onClick={handleNextDay}>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button size="sm" onClick={() => handleOpenAddModal("sarapan")} className="ml-2">
            <Plus className="w-4 h-4 mr-1" /> Catat Makanan
          </Button>
        </div>
      </div>

      {/* Progress Ring and Metrics */}
      <CalorieRingProgress
        consumed={summary.totalCalories}
        target={profile.targetCalories || 2000}
        burned={workoutBurned}
      />

      {/* Makronutrisi */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Rincian Makronutrisi Hari Ini
        </h3>
        <MacroNutrientBar
          current={{
            protein: summary.totalProtein,
            carbs: summary.totalCarbs,
            fat: summary.totalFat,
          }}
          target={targetMacros}
        />
      </div>

      {/* Food Logs by Meals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Menu Makanan ({logs.length} item)
          </h3>
          <button
            onClick={() => void loadData(currentDate)}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        <FoodLogList
          logs={logs}
          onDeleteLog={handleDeleteFood}
          onOpenAddModal={handleOpenAddModal}
        />
      </div>

      {/* Modal Tambah Makanan */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFood={handleAddFood}
        initialMealType={activeMealType}
        currentDate={currentDate}
      />
    </div>
  );
}
