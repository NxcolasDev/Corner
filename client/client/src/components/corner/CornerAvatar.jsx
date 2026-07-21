const CornerAvatar = ({ src, alt = "Avatar", className = "", badge }) => {
  return (
    <div className={`relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.75rem] bg-slate-950 text-white ${className}`.trim()}>
      {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : <span className="text-xl font-black">{alt?.slice(0, 1)}</span>}
      {badge && <div className="absolute -bottom-1 -right-1 rounded-full bg-sky-500 px-2 py-1 text-[0.55rem] font-bold uppercase text-white shadow-lg shadow-sky-500/15">{badge}</div>}
    </div>
  );
};

export default CornerAvatar;
