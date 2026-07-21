const CornerTextSection = ({ label, title, description, action }) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-500">{label}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default CornerTextSection;
