const CornerContentContainer = ({ children, className = "" }) => {
  return (
    <div className={`rounded-2xl bg-slate-50 p-5 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.12)] ${className}`.trim()}>
      {children}
    </div>
  );
};

export default CornerContentContainer;
