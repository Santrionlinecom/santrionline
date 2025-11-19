import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}

export function MetricCard({ title, value, hint, icon }: MetricCardProps) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-blue-700">{value}</p>
        {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
      </div>
    </div>
  );
}
