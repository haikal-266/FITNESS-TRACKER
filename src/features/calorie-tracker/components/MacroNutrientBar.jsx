import { formatNumber } from "@/lib/utils";

export function MacroNutrientBar({ current = { protein: 0, carbs: 0, fat: 0 }, target = { protein: 140, carbs: 220, fat: 60 } }) {
  const macros = [
    {
      label: "Protein",
      current: current.protein || 0,
      target: target.protein || 140,
      color: "from-blue-500 to-indigo-500",
      textColor: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Karbohidrat",
      current: current.carbs || 0,
      target: target.carbs || 220,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-400",
      bgColor: "bg-amber-500/20",
    },
    {
      label: "Lemak",
      current: current.fat || 0,
      target: target.fat || 60,
      color: "from-rose-500 to-pink-500",
      textColor: "text-rose-400",
      bgColor: "bg-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {macros.map((m) => {
        const pct = Math.min(100, Math.round((m.current / m.target) * 100)) || 0;
        return (
          <div key={m.label} className="p-4 rounded-xl glass-panel space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-semibold ${m.textColor}`}>{m.label}</span>
              <span className="text-slate-400">
                <strong className="text-white">{formatNumber(m.current)}g</strong> / {formatNumber(m.target)}g
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{pct}% terpenuhi</span>
              <span>{Math.max(0, m.target - m.current)}g sisa</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
