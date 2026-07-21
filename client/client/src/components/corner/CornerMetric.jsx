const CornerMetric = ({ label, value, detail, icon, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-white text-slate-950",
    accent: "bg-slate-950 text-white",
  };

  return (
    <div className={`rounded-xl border border-slate-200/75 p-4 shadow-sm ${variants[variant]} ${className}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold leading-none tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-950">
            {icon}
          </div>
        )}
      </div>
      {detail && <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>}
    </div>
  );
};

export default CornerMetric;
