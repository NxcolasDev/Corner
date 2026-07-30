import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#0f172a", "#0ea5e9", "#6366f1", "#f59e0b", "#10b981"];

const CategoryChart = ({ data = [] }) => {
  return (
    <div className="h-72 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-3">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Card categories</p>
        <h3 className="mt-1 text-lg font-bold text-slate-950">Difficulty distribution</h3>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} cards`} />
          <Legend verticalAlign="bottom" align="center" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;