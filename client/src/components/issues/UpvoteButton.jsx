import Button from "../common/Button";

export default function UpvoteButton({ active, count, onClick, disabled = false }) {
  return (
    <Button
      variant={active ? "primary" : "secondary"}
      onClick={onClick}
      disabled={disabled}
      className="min-w-[110px]"
    >
      {active ? "Upvoted" : "Upvote"} · {count}
    </Button>
  );
}
