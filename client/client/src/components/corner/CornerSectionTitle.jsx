const CornerSectionTitle = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`space-y-1 ${className}`.trim()}>
      <div className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-blue-500">
        <span className="h-1 w-5 rounded-full bg-blue-500"></span>
        <span>{subtitle}</span>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-950">{title}</h2>
    </div>
  );
};

export default CornerSectionTitle;
