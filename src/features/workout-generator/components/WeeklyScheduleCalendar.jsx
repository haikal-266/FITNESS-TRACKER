"use client";

import { useState } from "react";
import { Dumbbell, Moon, Sparkles } from "lucide-react";
import { ExerciseCard } from "./ExerciseCard";
import { Button } from "@/components/ui/Button";
import { getIndonesianDayName } from "@/lib/utils";

export function WeeklyScheduleCalendar({
  schedules = [],
  userWeight = 65,
  onLogExercise,
  completedExerciseNames = [],
  onOpenGenerator,
}) {
  const todayName = getIndonesianDayName();
  const [activeDay, setActiveDay] = useState(todayName);

  const selectedSchedule = schedules.find((s) => s.day === activeDay) || schedules[0];
  
  let exercises = [];
  if (selectedSchedule) {
    if (typeof selectedSchedule.exercises === "string") {
      try {
        exercises = JSON.parse(selectedSchedule.exercises || "[]");
      } catch {
        exercises = [];
      }
    } else if (Array.isArray(selectedSchedule.exercises)) {
      exercises = selectedSchedule.exercises;
    }
  }

  return (
    <div className="space-y-6">
      {/* 7-Day Navigation Tabs */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 p-1.5 rounded-2xl glass-panel">
        {schedules.map((s) => {
          const isSelected = s.day === activeDay;
          const isToday = s.day === todayName;

          return (
            <button
              key={s.day}
              onClick={() => setActiveDay(s.day)}
              className={`flex flex-col items-center py-2.5 px-1 sm:px-2 rounded-xl transition-all text-center relative ${
                isSelected
                  ? "bg-gradient-to-b from-emerald-500/20 to-teal-500/10 border border-emerald-500/50 shadow-md shadow-emerald-500/10"
                  : "hover:bg-slate-800/60 text-slate-400"
              }`}
            >
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
              )}
              <span className="text-[11px] sm:text-xs font-bold block text-slate-300">
                {s.day.slice(0, 3)}
              </span>
              <div className="mt-1">
                {s.isRestDay ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day View */}
      {selectedSchedule && (
        <div className="rounded-2xl glass-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Jadwal Hari {selectedSchedule.day}
                </h3>
                {selectedSchedule.day === todayName && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Hari Ini
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSchedule.focus}</p>
            </div>

            <Button size="sm" variant="outline" onClick={onOpenGenerator}>
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Buat Ulang Jadwal
            </Button>
          </div>

          {/* Rest Day Message or List of Exercises */}
          {selectedSchedule.isRestDay ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <Moon className="w-7 h-7 text-indigo-400" />
              </div>
              <h4 className="text-base font-bold text-white">Hari Pemulihan (Rest Day)</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Otot Anda tumbuh dan pulih saat istirahat. Lakukan peregangan ringan, minum cukup air,
                dan pastikan tidur 7-8 jam.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map((ex) => (
                <ExerciseCard
                  key={ex.nama}
                  exercise={ex}
                  userWeight={userWeight}
                  onLogExercise={onLogExercise}
                  isCompletedToday={completedExerciseNames.includes(ex.nama)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
