"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Search, Plus, Utensils } from "lucide-react";

export function AddFoodModal({ isOpen, onClose, onAddFood, initialMealType = "sarapan", currentDate }) {
  const [tab, setTab] = useState("preset"); // "preset" | "manual"
  const [mealType, setMealType] = useState(initialMealType);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(1);

  // Manual form state
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualPortion, setManualPortion] = useState(1);
  const [manualUnit, setManualUnit] = useState("porsi");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMealType(initialMealType);
      fetch(`/api/foods?q=${encodeURIComponent(search)}`)
        .then((r) => r.json())
        .then((data) => {
          setFoodItems(data);
          if (data.length > 0 && !selectedFood) {
            setSelectedFood(data[0]);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, search, initialMealType]);

  const handleSubmitPreset = (e) => {
    e.preventDefault();
    if (!selectedFood) return;

    onAddFood({
      date: currentDate,
      mealType,
      foodName: selectedFood.name,
      portion: Number(portion),
      unit: selectedFood.unit,
      calories: Math.round(selectedFood.calories * Number(portion)),
      protein: Math.round((selectedFood.protein || 5) * Number(portion)),
      carbs: Math.round((selectedFood.carbs || 20) * Number(portion)),
      fat: Math.round((selectedFood.fat || 3) * Number(portion)),
    });
    onClose();
  };

  const handleSubmitManual = (e) => {
    e.preventDefault();
    if (!manualName || !manualCalories) return;

    onAddFood({
      date: currentDate,
      mealType,
      foodName: manualName,
      portion: Number(manualPortion) || 1,
      unit: manualUnit || "porsi",
      calories: Math.round(Number(manualCalories)),
      protein: Number(manualProtein) || 0,
      carbs: Number(manualCarbs) || 0,
      fat: Number(manualFat) || 0,
    });
    onClose();
  };

  const mealOptions = [
    { value: "sarapan", label: "🍳 Sarapan Pagi" },
    { value: "siang", label: "🍛 Makan Siang" },
    { value: "malam", label: "🍲 Makan Malam" },
    { value: "snack", label: "🍎 Snack & Cemilan" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Catat Makanan Baru">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 mb-4">
        <button
          type="button"
          onClick={() => setTab("preset")}
          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-all ${
            tab === "preset"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Database Makanan
        </button>
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-all ${
            tab === "manual"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Input Manual
        </button>
      </div>

      <div className="mb-4">
        <Select
          label="Waktu Makan"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          options={mealOptions}
        />
      </div>

      {tab === "preset" ? (
        <form onSubmit={handleSubmitPreset} className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Cari makanan (misal: Nasi, Telur, Ayam)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 border border-slate-800 rounded-xl p-1 bg-slate-950/40">
            {foodItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFood(item)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-all ${
                  selectedFood?.id === item.id
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-white"
                    : "hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                <div>
                  <span className="font-medium text-sm block">{item.name}</span>
                  <span className="text-xs text-slate-400">{item.unit}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 text-sm">{item.calories}</span>
                  <span className="text-[10px] text-slate-500 block">kkal</span>
                </div>
              </button>
            ))}
          </div>

          {selectedFood && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Kalori Terhitung:</span>
                <span className="block text-lg font-bold text-emerald-400">
                  {Math.round(selectedFood.calories * Number(portion))} kkal
                </span>
              </div>
              <div className="w-32">
                <Input
                  label="Jumlah Porsi"
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={!selectedFood}>
              <Plus className="w-4 h-4 mr-1" /> Tambahkan ke Menu
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitManual} className="space-y-3">
          <Input
            label="Nama Makanan / Minuman"
            placeholder="Contoh: Oatmeal Pisang Madu"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jumlah Kalori (kkal)"
              type="number"
              placeholder="Contoh: 320"
              value={manualCalories}
              onChange={(e) => setManualCalories(e.target.value)}
              required
            />
            <Input
              label="Porsi"
              type="number"
              step="0.5"
              value={manualPortion}
              onChange={(e) => setManualPortion(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Protein (g)"
              type="number"
              placeholder="0"
              value={manualProtein}
              onChange={(e) => setManualProtein(e.target.value)}
            />
            <Input
              label="Karbo (g)"
              type="number"
              placeholder="0"
              value={manualCarbs}
              onChange={(e) => setManualCarbs(e.target.value)}
            />
            <Input
              label="Lemak (g)"
              type="number"
              placeholder="0"
              value={manualFat}
              onChange={(e) => setManualFat(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-1" /> Simpan Makanan
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
