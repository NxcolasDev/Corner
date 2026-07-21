import { Info } from "lucide-react";

const StatCard = ({ label, value, detail, tone = "default" }) => {
  const toneClasses = {
    default: "bg-white text-slate-950 border-slate-200/80",
    accent: "bg-slate-950 text-white border-slate-800",
    success: "bg-emerald-50 text-emerald-950 border-emerald-200",
  };

  return (
    <div className={`rounded-[2.5rem] border p-7 shadow-[0_24px_64px_-40px_rgba(15,23,42,0.14)] ${toneClasses[tone] || toneClasses.default}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
          <p className="mt-4 text-5xl font-black leading-none">{value}</p>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-[1.75rem] bg-slate-100 text-slate-700 shadow-[0_18px_42px_-24px_rgba(15,23,42,0.16)]">
          <Info size={24} />
        </div>
      </div>
      {detail && <p className="mt-5 text-sm leading-6 text-slate-500">{detail}</p>}
    </div>
  );
};

export default StatCard;
