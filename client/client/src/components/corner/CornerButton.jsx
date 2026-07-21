const CornerButton = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700",
    secondary: "inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50",
    ghost: "inline-flex items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50",
  };

  return (
    <button className={`${variants[variant] || variants.primary} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default CornerButton;
