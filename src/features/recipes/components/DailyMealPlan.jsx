"use client";

import { Utensils, Clock, Flame, PlusCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getTodayDateString, formatNumber } from "@/lib/utils";
import { useState } from "react";

export function DailyMealPlan({ menuList = [], onAddRecipeToTracker }) {
  const [loggedRecipes, setLoggedRecipes] = useState([]);

  const handleLog = async (item) => {
    let mealType = "malam";
    if (item.kategori === "Sarapan") {
      mealType = "sarapan";
    } else if (item.kategori === "Makan siang") {
      mealType = "siang";
    }

    await onAddRecipeToTracker({
      date: getTodayDateString(),
      mealType,
      foodName: item.resep.nama,
      portion: 1,
      unit: "1 porsi",
      calories: item.resep.kalori,
    });
    setLoggedRecipes((prev) => [...prev, item.resep.id]);
  };

  const totalCalories = menuList.reduce((sum, item) => sum + (item.resep?.kalori || 0), 0);

  return (
    <div className="rounded-2xl glass-panel-glow p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Rekomendasi Menu Diet Hari Ini
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dihitung otomatis per tanggal untuk variasi gizi seimbang
          </p>
        </div>
        <div className="text-sm font-semibold text-emerald-400">
          Total: <strong className="text-white text-base">{formatNumber(totalCalories)}</strong> kkal
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menuList.map((item) => {
          const isLogged = loggedRecipes.includes(item.resep.id);
          return (
            <div
              key={item.kategori}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  {item.kategori}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{item.resep.nama}</h4>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {item.resep.waktu} mnt
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> {item.resep.kalori} kkal
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant={isLogged ? "secondary" : "outline"}
                disabled={isLogged}
                onClick={() => handleLog(item)}
                className="w-full text-xs"
              >
                {isLogged ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Masuk ke Tracker
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5 mr-1" /> Catat ke Tracker
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
