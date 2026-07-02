const COLORS = {
  default: "bg-primarylight text-primary",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-rose-50 text-rose-600",
};

export default function Badge({ children, tone = "default" }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
        (COLORS[tone] || COLORS.default)
      }
    >
      {children}
    </span>
  );
}
