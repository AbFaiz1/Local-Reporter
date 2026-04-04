export default function EmptyState({ title, description, action }) {
  return (
    <div className="surface flex flex-col items-start gap-3 p-6">
      <p className="text-lg font-bold text-ink">{title}</p>
      <p className="max-w-xl text-sm text-ink/65">{description}</p>
      {action}
    </div>
  );
}
