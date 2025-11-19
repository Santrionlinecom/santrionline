interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
}

export function ProgressBar({ label, value, max = 100 }: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="card p-4 space-y-2">
      <div className="flex justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="font-semibold text-blue-700">{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
