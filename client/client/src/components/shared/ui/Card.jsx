const Card = ({ as: Component = "div", variant = "default", className = "", children, ...props }) => {
  const variants = {
    default: "border border-slate-200/70 bg-white shadow-[0_22px_48px_-30px_rgba(15,23,42,0.14)]",
    elevated: "border border-transparent bg-white shadow-[0_28px_90px_-40px_rgba(15,23,42,0.18)]",
    subtle: "border border-slate-200/60 bg-slate-50 shadow-none",
  };

  return (
    <Component
      className={`rounded-[2rem] ${variants[variant] || variants.default} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
