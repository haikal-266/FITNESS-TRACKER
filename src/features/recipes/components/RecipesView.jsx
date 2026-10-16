"use client";

import { useState, useEffect } from "react";
import { DailyMealPlan } from "./DailyMealPlan";
import { RecipeCard } from "./RecipeCard";
import { hitungMenuHariIni } from "../services/recipeService";
import { getTodayDateString } from "@/lib/utils";
import { Utensils } from "lucide-react";

export function RecipesView() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(getTodayDateString());
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data) => setRecipes(data))
      .catch(console.error);
  }, []);

  const handleAddRecipeToTracker = async (payload) => {
    try {
      await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const todayMenu = hitungMenuHariIni(recipes, currentDate);

  const categories = ["Semua", "Sarapan", "Makan siang", "Makan malam"];
  const filtered = recipes.filter((r) => {
    return selectedCategory === "Semua" || r.category === selectedCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Daily Rotating Meal Plan Banner */}
      <DailyMealPlan menuList={todayMenu} onAddRecipeToTracker={handleAddRecipeToTracker} />

      {/* Recipe Catalog Header & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Katalog Resep Diet Sehat</h3>
            <span className="text-xs text-slate-400">Pilihan makanan rendah kalori dan bergizi tinggi</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Resep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
