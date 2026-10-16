"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Sparkles, Dumbbell } from "lucide-react";
import { generateCustomWorkoutPlan } from "../utils/generatorEngine";

export function WorkoutGeneratorModal({ isOpen, onClose, onScheduleGenerated }) {
  const [target, setTarget] = useState("fat_loss");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [level, setLevel] = useState("pemula");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const generated = generateCustomWorkoutPlan({
        target,
        daysPerWeek: Number(daysPerWeek),
        level,
      });

      const res = await fetch("/api/workouts/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules: generated }),
      });

      if (res.ok) {
        const saved = await res.json();
        onScheduleGenerated(saved);
        onClose();
      }
    } catch (err) {
      console.error("Gagal generate jadwal:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const targetOptions = [
    { value: "fat_loss", label: "🔥 Fat Loss & Pembakaran Lemak (HIIT + Kardio)" },
    { value: "muscle_gain", label: "💪 Pembentukan Otot & Hipertrofi (Push/Pull/Legs)" },
    { value: "endurance", label: "⚡ Stamina, Kebugaran & Kardio Menyeluruh" },
  ];

  const daysOptions = [
    { value: 3, label: "3 Hari / Minggu (Full Body Split - Ramah Waktu)" },
    { value: 4, label: "4 Hari / Minggu (Upper / Lower Split - Sangat Populer)" },
    { value: 5, label: "5 Hari / Minggu (Push / Pull / Legs / HIIT)" },
  ];

  const levelOptions = [
    { value: "pemula", label: "🌱 Pemula (Gerakan dasar, repetisi moderat)" },
    { value: "menengah", label: "⚡ Menengah (Volume set & repetisi bertambah)" },
    { value: "lanjutan", label: "🔥 Lanjutan (Intensitas tinggi & durasi maksimal)" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generator Jadwal Latihan Cerdas">
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
          <p>
            Algoritma akan menyusun jadwal 7 hari (Senin - Minggu) lengkap dengan variasi gerakan,
            jumlah set, repetisi/durasi, serta hari istirahat (Rest Day) secara proporsional.
          </p>
        </div>

        <Select
          label="Target Utama Kebugaran"
          options={targetOptions}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <Select
          label="Frekuensi Latihan Mingguan"
          options={daysOptions}
          value={daysPerWeek}
          onChange={(e) => setDaysPerWeek(e.target.value)}
        />

        <Select
          label="Level Kebugaran Saat Ini"
          options={levelOptions}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isGenerating}>
            Batal
          </Button>
          <Button type="submit" disabled={isGenerating}>
            <Dumbbell className="w-4 h-4 mr-1.5" />
            {isGenerating ? "Menyusun Jadwal..." : "Generate Jadwal Baru"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
