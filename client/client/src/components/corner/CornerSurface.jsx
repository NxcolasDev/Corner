const CornerSurface = ({ children, className = "", ...props }) => {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.18)] ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default CornerSurface;
