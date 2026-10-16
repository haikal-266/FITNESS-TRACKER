import { cn } from "@/lib/utils";

export function Card({ children, className, glow = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        glow ? "glass-panel-glow" : "glass-panel",
        "p-5 md:p-6 shadow-xl shadow-black/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn("mb-4 flex items-center justify-between", className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={cn("text-lg font-bold text-white tracking-tight", className)}>{children}</h3>;
}

export function CardDescription({ children, className }) {
  return <p className={cn("text-xs text-slate-400 mt-0.5", className)}>{children}</p>;
}
