const CornerCard = ({ as: Component = "div", className = "", children, ...props }) => {
  return (
    <Component
      className={`rounded-2xl border border-slate-200/75 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.15)] ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
};

export default CornerCard;
