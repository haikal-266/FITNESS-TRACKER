"use client";

import { Trash2, Plus, Coffee, Sun, Moon, Apple } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const MEAL_CATEGORIES = [
  { key: "sarapan", label: "Sarapan Pagi", icon: Coffee, color: "text-amber-400" },
  { key: "siang", label: "Makan Siang", icon: Sun, color: "text-orange-400" },
  { key: "malam", label: "Makan Malam", icon: Moon, color: "text-indigo-400" },
  { key: "snack", label: "Snack & Cemilan", icon: Apple, color: "text-emerald-400" },
];

export function FoodLogList({ logs = [], onDeleteLog, onOpenAddModal }) {
  return (
    <div className="space-y-4">
      {MEAL_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const categoryLogs = logs.filter((l) => l.mealType === cat.key);
        const subtotal = categoryLogs.reduce((sum, item) => sum + item.calories, 0);

        return (
          <div key={cat.key} className="rounded-2xl glass-panel p-4 md:p-5 transition-all">
            {/* Header Kategori */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">{cat.label}</h4>
                  <span className="text-xs text-slate-400">
                    Total: <strong className="text-emerald-400">{formatNumber(subtotal)}</strong> kkal
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenAddModal(cat.key)}
                className="text-xs py-1 px-2.5"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Tambah
              </Button>
            </div>

            {/* List Makanan Dalam Kategori */}
            {categoryLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3 text-center">
                Belum ada makanan dicatat untuk {cat.label.toLowerCase()}
              </p>
            ) : (
              <div className="divide-y divide-slate-800/60 mt-2">
                {categoryLogs.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between group hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-200 block">{item.foodName}</span>
                      <span className="text-xs text-slate-400">
                        {item.portion} {item.unit}
                        {(item.protein > 0 || item.carbs > 0 || item.fat > 0) && (
                          <span className="ml-2 text-[11px] text-slate-500">
                            (P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-emerald-400">
                        {formatNumber(item.calories)} <span className="text-[10px] text-slate-500 font-normal">kkal</span>
                      </span>
                      <button
                        onClick={() => onDeleteLog(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors opacity-80 group-hover:opacity-100"
                        title="Hapus Makanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
