export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="surface p-6">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 animate-pulse rounded-full bg-pine" />
        <p className="text-sm font-medium text-ink/70">{message}</p>
      </div>
    </div>
  );
}
