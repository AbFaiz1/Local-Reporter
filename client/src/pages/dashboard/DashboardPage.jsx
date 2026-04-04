import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyIssues } from "../../api/issueApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import StatusBadge from "../../components/issues/StatusBadge";
import PageHeader from "../../components/layout/PageHeader";
import { formatDate } from "../../utils/format";

export default function DashboardPage() {
  const [payload, setPayload] = useState({ issues: [], totalUpvotes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyIssues();

      if (!response.success) {
        throw new Error(response.message || "Unable to fetch dashboard");
      }

      setPayload({
        issues: response.issues,
        totalUpvotes: response.totalUpvotes
      });
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statusCounts = payload.issues.reduce(
    (accumulator, issue) => {
      accumulator[issue.status] += 1;
      return accumulator;
    },
    {
      pending: 0,
      "in-progress": 0,
      resolved: 0
    }
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Your reporting activity"
        description="Track all issues you have submitted, monitor how many are still pending, and measure the community support each report has gathered."
        actions={
          <Link to="/create">
            <Button>Create another issue</Button>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total issues", value: payload.issues.length },
          { label: "Total upvotes", value: payload.totalUpvotes },
          { label: "Pending", value: statusCounts.pending },
          { label: "Resolved", value: statusCounts.resolved }
        ].map(card => (
          <article key={card.label} className="surface p-5">
            <p className="text-sm text-ink/60">{card.label}</p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{card.value}</p>
          </article>
        ))}
      </section>

      {loading ? <LoadingState message="Loading your dashboard..." /> : null}
      {error ? <ErrorState message={error} onRetry={loadDashboard} /> : null}

      {!loading && !error && payload.issues.length === 0 ? (
        <EmptyState
          title="No issues submitted yet"
          description="Your dashboard will start filling up once you report your first issue."
          action={
            <Link to="/create">
              <Button>Create issue</Button>
            </Link>
          }
        />
      ) : null}

      <section className="grid gap-4">
        {payload.issues.map(issue => (
          <article key={issue._id} className="surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-moss">
                  {issue.category}
                </span>
                <StatusBadge status={issue.status} />
              </div>
              <p className="text-lg font-bold text-ink">{issue.description}</p>
              <p className="text-sm text-ink/55">Created {formatDate(issue.createdAt)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-mist px-4 py-3 text-sm font-semibold text-ink/70">
                Upvotes: {issue.upvoteCount}
              </div>
              <Link
                to={`/issues/${issue._id}`}
                className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
              >
                View issue
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
