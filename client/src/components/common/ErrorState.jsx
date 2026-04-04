import Button from "./Button";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="surface flex flex-col items-start gap-4 p-6">
      <p className="text-lg font-bold text-clay">Something went wrong</p>
      <p className="text-sm text-ink/70">{message}</p>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </div>
  );
}
