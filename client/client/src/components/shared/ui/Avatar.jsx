const Avatar = ({ src, alt = "Avatar", className = "" }) => {
  return (
    <div className={`inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-700 ${className}`.trim()}>
      {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : <span className="text-lg font-bold">{alt?.slice(0, 1)}</span>}
    </div>
  );
};

export default Avatar;
