export default function Badge({ variant = "success", className = "", children }) {
  const variants = {
    success: "badge badge-success",
    warning: "badge badge-warning",
    danger: "badge badge-danger",
  };
  return <span className={`${variants[variant] || "badge"} ${className}`}>{children}</span>;
}
