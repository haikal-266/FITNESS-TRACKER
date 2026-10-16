"use client";

import { useState } from "react";
import { Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function RecipeCard({ recipe }) {
  const [isOpen, setIsOpen] = useState(false);

  const rawIngredients = recipe.ingredients || recipe.bahan;
  let ingredients = [];
  if (Array.isArray(rawIngredients)) {
    ingredients = rawIngredients;
  } else if (typeof rawIngredients === "string") {
    try {
      ingredients = JSON.parse(rawIngredients || "[]");
    } catch {
      ingredients = [];
    }
  }

  const rawSteps = recipe.steps || recipe.langkah;
  let steps = [];
  if (Array.isArray(rawSteps)) {
    steps = rawSteps;
  } else if (typeof rawSteps === "string") {
    try {
      steps = JSON.parse(rawSteps || "[]");
    } catch {
      steps = [];
    }
  }

  const category = recipe.category || recipe.kategori;
  let badgeVariant = "emerald";
  if (category === "Sarapan") {
    badgeVariant = "amber";
  } else if (category === "Makan siang") {
    badgeVariant = "sky";
  }

  const name = recipe.name || recipe.nama;
  const calories = recipe.calories || recipe.kalori;
  const cookingTime = recipe.cookingTime || recipe.waktu || 20;
  const portions = recipe.portions || recipe.porsi || 1;

  return (
    <div className="rounded-2xl glass-panel p-5 transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant={badgeVariant}>{category}</Badge>
          <h4 className="text-base font-bold text-white mt-1.5">{name}</h4>
        </div>

        <div className="text-right">
          <span className="text-lg font-extrabold text-emerald-400 block">
            {calories}{" "}
            <span className="text-xs text-slate-400 font-normal">kkal</span>
          </span>
          <span className="text-[10px] text-slate-500">per porsi</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" /> {cookingTime} Menit
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-slate-500" /> {portions} Porsi
        </span>
      </div>

      {/* Accordion Toggle Bahan & Langkah */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pt-2 flex items-center justify-between text-xs text-slate-400 hover:text-white border-t border-slate-800 transition-colors"
      >
        <span>{isOpen ? "Tutup Resep & Bahan" : "Lihat Bahan & Cara Masak"}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="space-y-4 pt-2 border-t border-slate-800/60 text-xs">
          <div>
            <span className="font-semibold text-slate-200 block mb-1">Bahan-Bahan:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              {ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="font-semibold text-slate-200 block mb-1">Langkah Memasak:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
              {steps.map((st) => (
                <li key={st}>{st}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
