const Button = ({
  children,
  variant = "primary",
  color,
  className = "",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-2xl font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    destructive: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    rating: "border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/70",
  };

  const colorClasses = {
    again: "bg-rose-50 text-rose-700 hover:bg-rose-100",
    hard: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    medium: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    easy: "bg-sky-50 text-sky-700 hover:bg-sky-100",
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${variants[variant] || variants.primary} ${color ? colorClasses[color] : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
