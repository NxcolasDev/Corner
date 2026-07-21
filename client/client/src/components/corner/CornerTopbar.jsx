const CornerTopbar = ({ children, className = "" }) => {
  return (
    <header className={`mb-6 rounded-[2rem] bg-white px-4 py-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.12)] ${className}`.trim()}>
      {children}
    </header>
  );
};

export default CornerTopbar;
