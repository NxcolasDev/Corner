import { CornerCard } from "../corner";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const ProgressChart = ({ data = [] }) => {
  const totalProgress = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <CornerCard className="h-72 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Study progress</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">Weekly completion</h3>
        </div>
        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
          {totalProgress}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height="78%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <defs><linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={.25} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="#e9eef7" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 10, borderColor: "#e2e8f0", fontSize: 12 }} />
          <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} fill="url(#progressGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </CornerCard>
  );
};

export default ProgressChart;
