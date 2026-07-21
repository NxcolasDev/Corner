const Input = ({ as: Component = "input", className = "", ...props }) => {
  const commonClasses = "w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm shadow-slate-200/30 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";

  return <Component className={`${commonClasses} ${className}`.trim()} {...props} />;
};

export default Input;
