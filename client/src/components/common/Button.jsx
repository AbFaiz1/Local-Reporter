export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) {
  const styles = {
    primary: "bg-ink text-white hover:bg-ink/90",
    secondary: "bg-white text-ink border border-line hover:bg-mist",
    ghost: "bg-transparent text-ink hover:bg-ink/5"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
