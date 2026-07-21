const SectionHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-slate-400">{subtitle}</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">{title}</h2>
      </div>
      {action && <div className="min-w-[160px]">{action}</div>}
    </div>
  );
};

export default SectionHeader;
