const ChartCard = ({ title, description, children }) => {
  return (
    <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_64px_-40px_rgba(15,23,42,0.14)]">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-400">{description}</p>
          <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">Live</span>
        </div>
        <h3 className="mt-3 text-2xl font-black text-slate-950">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
