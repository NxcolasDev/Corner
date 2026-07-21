const CornerBadge = ({ children, className = "", tone = "default", ...props }) => {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    info: "bg-sky-100 text-sky-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] ${tones[tone] || tones.default} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
};

export default CornerBadge;
