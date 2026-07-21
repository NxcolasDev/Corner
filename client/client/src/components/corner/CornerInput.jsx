const CornerInput = ({ as: Component = "input", className = "", ...props }) => {
  const base = "w-full rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm shadow-slate-200/40 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";
  return <Component className={`${base} ${className}`.trim()} {...props} />;
};

export default CornerInput;
