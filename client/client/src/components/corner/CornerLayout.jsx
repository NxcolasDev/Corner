const CornerLayout = ({ children, className = "", ...props }) => {
  return (
    <div className={`min-h-screen bg-[#f5f7fb] text-slate-900 ${className}`.trim()} {...props}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-4 lg:px-6 lg:py-6">
        {children}
      </div>
    </div>
  );
};

export default CornerLayout;
