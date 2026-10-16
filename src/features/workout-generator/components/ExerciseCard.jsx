"use client";

import { useState } from "react";
import { CheckCircle2, Flame, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { hitungKaloriTerbakar } from "../utils/workoutMath";

export function ExerciseCard({ exercise, userWeight = 65, onLogExercise, isCompletedToday = false }) {
  const [isLogged, setIsLogged] = useState(isCompletedToday);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const burn = hitungKaloriTerbakar({
    met: exercise.met,
    beratBadan: userWeight,
    tipe: exercise.tipe,
    set: exercise.set,
    nilai: exercise.nilai,
    detikPerRep: exercise.detikPerRep || 3,
  });

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await onLogExercise({
        exerciseName: exercise.nama,
        targetMuscle: exercise.fokus,
        sets: exercise.set || 3,
        value: exercise.nilai || 10,
        unit: exercise.tipe || "rep",
        caloriesBurned: burn.kkal,
        fatGrams: burn.lemakGram,
      });
      setIsLogged(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`p-4 md:p-5 rounded-2xl glass-panel transition-all border ${
        isLogged
          ? "border-emerald-500/40 bg-emerald-950/15"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Detail Latihan */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white tracking-wide">{exercise.nama}</h4>
            {isLogged && (
              <Badge variant="emerald" className="gap-1">
                <Check className="w-3 h-3" /> Selesai
              </Badge>
            )}
          </div>
          <span className="text-xs text-emerald-400 font-medium block">
            Target: {exercise.fokus || "Kebugaran Fisik"}
          </span>
          {exercise.tips && (
            <p className="text-xs text-slate-400 flex items-start gap-1 pt-1">
              <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>{exercise.tips}</span>
            </p>
          )}
        </div>

        {/* Repetisi / Set & Estimasi Kalori */}
        <div className="flex items-center gap-4 sm:text-right">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Volume</span>
            <span className="text-sm font-extrabold text-white">
              {exercise.set ? `${exercise.set} Set × ` : ""}
              {exercise.nilai} {exercise.tipe}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Terbakar
            </span>
            <span className="text-sm font-extrabold text-orange-400">
              ~{burn.kkal} <span className="text-[10px] text-slate-500">kkal</span>
            </span>
          </div>

          <Button
            size="sm"
            variant={isLogged ? "secondary" : "primary"}
            disabled={isLogged || isSubmitting}
            onClick={handleFinish}
            className="whitespace-nowrap"
          >
            {isLogged ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1" /> Tercatat
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" /> Selesai Latihan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
