const Badge = ({ children, className = "", ...props }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${className}`.trim()}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
