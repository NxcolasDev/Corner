import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const ActivityChart = ({ data = [] }) => {
  return (
    <div className="h-72 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-3">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Recent activity</p>
        <h3 className="mt-1 text-lg font-bold text-slate-950">Flashcard reviews</h3>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b" }} />
          <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }} />
          <Area type="monotone" dataKey="reviews" stroke="#0ea5e9" strokeWidth={3} fill="url(#activityGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;