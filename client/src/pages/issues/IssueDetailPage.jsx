import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addIssueComment, getIssueComments } from "../../api/commentApi";
import { getIssueById, toggleIssueUpvote } from "../../api/issueApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import IssueMedia from "../../components/issues/IssueMedia";
import StatusBadge from "../../components/issues/StatusBadge";
import UpvoteButton from "../../components/issues/UpvoteButton";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/format";

export default function IssueDetailPage() {
  const { issueId } = useParams();
  const { isAuthenticated, userId } = useAuth();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [issueResponse, commentsResponse] = await Promise.all([
        getIssueById(issueId),
        getIssueComments(issueId)
      ]);

      if (!issueResponse.success) {
        throw new Error(issueResponse.message || "Unable to fetch issue");
      }

      if (!commentsResponse.success) {
        throw new Error(commentsResponse.message || "Unable to fetch comments");
      }

      setIssue({
        ...issueResponse.issue,
        hasUpvoted: issueResponse.issue.upvote?.some(id => id === userId || id?._id === userId)
      });
      setComments(commentsResponse.comments);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [issueId, userId]);

  const handleCommentSubmit = async event => {
    event.preventDefault();
    setCommentLoading(true);
    setError("");

    try {
      const response = await addIssueComment({ issueId, text: commentText });

      if (!response.success) {
        throw new Error(response.message || "Unable to add comment");
      }

      setCommentText("");
      await loadData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!issue) {
      return;
    }

    const nextHasUpvoted = !issue.hasUpvoted;

    setVoteLoading(true);
    setIssue(current => ({
      ...current,
      hasUpvoted: nextHasUpvoted,
      upvoteCount: current.upvoteCount + (nextHasUpvoted ? 1 : -1)
    }));

    try {
      const response = await toggleIssueUpvote(issueId);

      if (!response.success) {
        throw new Error(response.message || "Unable to update vote");
      }

      setIssue(current => ({
        ...current,
        hasUpvoted: response.hasUpvoted,
        upvoteCount: response.totalUpvote
      }));
    } catch (voteError) {
      setError(voteError.message);
      await loadData();
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading issue details..." />;
  }

  if (error && !issue) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!issue) {
    return (
      <EmptyState
        title="Issue not found"
        description="The requested issue could not be loaded. It may have been removed or the link is invalid."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
      <section className="space-y-6">
        <div className="surface p-6">
          <IssueMedia src={issue.image} alt={issue.description} />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-moss">
                {issue.category}
              </span>
              <StatusBadge status={issue.status} />
            </div>
            <p className="text-sm text-ink/55">{formatDate(issue.createdAt)}</p>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-ink">{issue.description}</h1>
          <p className="mt-4 text-sm leading-7 text-ink/70">
            Reported by {issue.user?.username || "Unknown user"} {issue.user?.email ? `(${issue.user.email})` : ""}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <UpvoteButton
                active={issue.hasUpvoted}
                count={issue.upvoteCount}
                onClick={handleUpvote}
                disabled={voteLoading}
              />
            ) : (
              <p className="rounded-2xl bg-mist px-4 py-3 text-sm font-semibold text-ink/70">
                Upvotes: {issue.upvoteCount}
              </p>
            )}
          </div>
        </div>

        <section className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-ink">Comments</h2>
            <p className="text-sm text-ink/55">{comments.length} total</p>
          </div>

          {isAuthenticated ? (
            <form className="mt-5 space-y-4" onSubmit={handleCommentSubmit}>
              <textarea
                className="field min-h-28"
                required
                placeholder="Add context, updates, or observations..."
                value={commentText}
                onChange={event => setCommentText(event.target.value)}
              />
              <Button type="submit" disabled={commentLoading}>
                {commentLoading ? "Posting..." : "Add comment"}
              </Button>
            </form>
          ) : (
            <p className="mt-5 rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-ink/65">
              Login to join the discussion.
            </p>
          )}

          {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="mt-6 space-y-4">
            {comments.length === 0 ? (
              <EmptyState
                title="No comments yet"
                description="Be the first person to add context or confirm the severity of this issue."
              />
            ) : (
              comments.map(comment => (
                <article key={comment._id} className="rounded-[1.2rem] bg-mist p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-ink">{comment.user?.username || "Resident"}</p>
                    <p className="text-xs text-ink/45">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-ink/75">{comment.text}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

      <aside className="space-y-6">
        <div className="surface p-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-pine">Issue metadata</p>
          <dl className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm text-ink/55">Issue ID</dt>
              <dd className="max-w-[60%] truncate text-sm font-semibold text-ink">{issue._id}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm text-ink/55">Latitude</dt>
              <dd className="text-sm font-semibold text-ink">{issue.location?.coordinates?.[1] ?? "--"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm text-ink/55">Longitude</dt>
              <dd className="text-sm font-semibold text-ink">{issue.location?.coordinates?.[0] ?? "--"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm text-ink/55">Status</dt>
              <dd><StatusBadge status={issue.status} /></dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
