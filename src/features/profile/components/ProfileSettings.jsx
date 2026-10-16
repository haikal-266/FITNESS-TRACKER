"use client";

import { useState, useEffect } from "react";
import { User, Activity, Target, Save, CheckCircle2, Flame, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  hitungBMR,
  hitungTDEE,
  hitungTargetKalori,
  hitungMakronutrisi,
  FAKTOR_AKTIVITAS,
} from "@/features/calorie-tracker/utils/calorieMath";
import { formatNumber } from "@/lib/utils";

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "Mahasiswa",
    age: 21,
    gender: "pria",
    height: 172,
    weight: 68,
    activityLevel: "sedang",
    goal: "turun",
    targetCalories: 1950,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) setProfile(data);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const updated = { ...prev, [name]: value };
      // Recalculate target calories automatically
      const calculatedTarget = hitungTargetKalori({
        umur: updated.age,
        gender: updated.gender,
        tinggi: updated.height,
        berat: updated.weight,
        aktivitas: updated.activityLevel,
        tujuan: updated.goal,
      });
      return { ...updated, targetCalories: calculatedTarget };
    });
    setIsSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Live calculations
  const bmr = hitungBMR({
    umur: profile.age,
    gender: profile.gender,
    tinggi: profile.height,
    berat: profile.weight,
  });

  const tdee = hitungTDEE({
    umur: profile.age,
    gender: profile.gender,
    tinggi: profile.height,
    berat: profile.weight,
    aktivitas: profile.activityLevel,
  });

  const macros = hitungMakronutrisi(profile.targetCalories, profile.goal);

  const activityOptions = Object.entries(FAKTOR_AKTIVITAS).map(([key, val]) => ({
    value: key,
    label: `${val.label} (${val.nilai}x)`,
  }));

  const genderOptions = [
    { value: "pria", label: "Pria (Rumus Mifflin +5)" },
    { value: "wanita", label: "Wanita (Rumus Mifflin -161)" },
  ];

  const goalOptions = [
    { value: "turun", label: "📉 Turunkan Berat Badan (Defisit 500 kkal)" },
    { value: "tetap", label: "⚖️ Pertahankan Berat Badan (Maintenance TDEE)" },
    { value: "naik", label: "📈 Naikkan Berat Badan / Lean Bulk (Surplus 300 kkal)" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel-glow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
            <User className="w-3.5 h-3.5" /> Konfigurasi Profil & Target Kalori
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Kalkulator BMR & TDEE Ilmiah
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Menggunakan standar formula Mifflin-St Jeor sesuai pedoman gizi klinis.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Profil Tersimpan ke SQLite!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Inputs (2 Kolom di Desktop) */}
        <div className="md:col-span-2 rounded-2xl glass-panel p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Jenis Kelamin"
                name="gender"
                options={genderOptions}
                value={profile.gender}
                onChange={handleChange}
              />
              <Input
                label="Umur (Tahun)"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tinggi Badan (cm)"
                name="height"
                type="number"
                value={profile.height}
                onChange={handleChange}
                required
              />
              <Input
                label="Berat Badan (kg)"
                name="weight"
                type="number"
                step="0.5"
                value={profile.weight}
                onChange={handleChange}
                required
              />
            </div>

            <Select
              label="Tingkat Aktivitas Fisik"
              name="activityLevel"
              options={activityOptions}
              value={profile.activityLevel}
              onChange={handleChange}
            />

            <Select
              label="Tujuan Kebugaran"
              name="goal"
              options={goalOptions}
              value={profile.goal}
              onChange={handleChange}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-1.5" />
                {isSaving ? "Menyimpan ke Database..." : "Simpan Profil & Target"}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Calculation Cards (1 Kolom) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-400" /> Hasil Kalkulasi
            </span>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">BMR (Metabolisme Dasar)</span>
              <span className="text-xl font-extrabold text-white">{formatNumber(bmr)}</span>
              <span className="text-[10px] text-slate-500 block">kkal jika tidur seharian</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block">TDEE (Total Kebutuhan)</span>
              <span className="text-xl font-extrabold text-teal-400">{formatNumber(tdee)}</span>
              <span className="text-[10px] text-slate-500 block">kkal untuk pertahankan BB</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <span className="text-xs text-emerald-300 font-semibold block flex items-center gap-1">
                <Flame className="w-4 h-4 text-emerald-400" /> Rekomendasi Target
              </span>
              <span className="text-2xl font-black text-white block mt-0.5">
                {formatNumber(profile.targetCalories)} <span className="text-xs text-slate-300 font-normal">kkal / hari</span>
              </span>
            </div>
          </div>

          {/* Makro Split */}
          <div className="p-5 rounded-2xl glass-panel space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
              Alokasi Makronutrisi Harian
            </span>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between items-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-300 font-medium">Protein (30-35%)</span>
                <span className="font-bold text-white">{macros.protein} gram</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-300 font-medium">Karbohidrat (40-45%)</span>
                <span className="font-bold text-white">{macros.karbo} gram</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-300 font-medium">Lemak Sehat (20-25%)</span>
                <span className="font-bold text-white">{macros.lemak} gram</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
