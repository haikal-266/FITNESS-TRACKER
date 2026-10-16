import { cn } from "@/lib/utils";

export function Badge({ children, variant = "emerald", className }) {
  const variants = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant] || variants.emerald,
        className
      )}
    >
      {children}
    </span>
  );
}
