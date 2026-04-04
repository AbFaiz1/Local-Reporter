import { Link } from "react-router-dom";
import { formatDate, formatDistance } from "../../utils/format";
import IssueMedia from "./IssueMedia";
import StatusBadge from "./StatusBadge";
import UpvoteButton from "./UpvoteButton";

export default function IssueCard({ issue, onUpvote, canUpvote, voting }) {
  return (
    <article className="surface flex h-full flex-col gap-4 p-4">
      <IssueMedia src={issue.image} alt={issue.description} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-moss">
          {issue.category}
        </span>
        <StatusBadge status={issue.status} />
      </div>

      <div className="flex-1">
        <p className="text-base font-semibold leading-7 text-ink">{issue.description}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink/60">
          <span>{formatDistance(issue.distance)}</span>
          <span>{formatDate(issue.createdAt)}</span>
          <span>By {issue.user?.username || "Unknown user"}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/issues/${issue._id}`}
          className="text-sm font-bold text-pine transition hover:text-ink"
        >
          View details
        </Link>

        {canUpvote ? (
          <UpvoteButton
            active={issue.hasUpvoted}
            count={issue.upvoteCount}
            onClick={() => onUpvote(issue)}
            disabled={voting}
          />
        ) : (
          <p className="text-sm font-semibold text-ink/55">Upvotes: {issue.upvoteCount}</p>
        )}
      </div>
    </article>
  );
}
