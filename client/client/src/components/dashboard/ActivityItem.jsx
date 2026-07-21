const ActivityItem = ({ title, subtitle, status }) => {
  const statusClasses = {
    new: "bg-sky-50 text-sky-700",
    progress: "bg-emerald-50 text-emerald-700",
    paused: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="flex items-center justify-between rounded-[2rem] border border-slate-200/80 bg-slate-50 px-5 py-4 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.12)]">
      <div>
        <p className="text-sm font-semibold text-slate-950">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] ${statusClasses[status] || statusClasses.paused}`}>
        {status}
      </span>
    </div>
  );
};

export default ActivityItem;
