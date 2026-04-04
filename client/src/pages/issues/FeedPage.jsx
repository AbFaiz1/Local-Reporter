import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNearbyIssues, toggleIssueUpvote } from "../../api/issueApi";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import IssueCard from "../../components/issues/IssueCard";
import IssueFilters from "../../components/issues/IssueFilters";
import PageHeader from "../../components/layout/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import useGeoLocation from "../../hooks/useGeoLocation";

const defaultFilters = {
  search: "",
  category: "all",
  status: "all",
  sortBy: "latest"
};

export default function FeedPage() {
  const { isAuthenticated, userId } = useAuth();
  const { coordinates, loading: geoLoading, error: geoError, requestLocation } = useGeoLocation(true);
  const [filters, setFilters] = useState(defaultFilters);
  const debouncedSearch = useDebounce(filters.search);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [votingIssueId, setVotingIssueId] = useState("");

  const fetchIssues = async () => {
    if (!coordinates.lat || !coordinates.lng) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getNearbyIssues({
        lat: coordinates.lat,
        lng: coordinates.lng,
        category: filters.category === "all" ? undefined : filters.category,
        status: filters.status === "all" ? undefined : filters.status,
        search: debouncedSearch || undefined,
        sortBy: filters.sortBy
      });

      if (!response.success) {
        throw new Error(response.message || "Unable to fetch issues");
      }

      setIssues(
        response.issues.map(issue => ({
          ...issue,
          hasUpvoted: issue.upvote?.some(id => id === userId || id?._id === userId)
        }))
      );
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [coordinates.lat, coordinates.lng, filters.category, filters.status, filters.sortBy, debouncedSearch]);

  const handleFilterChange = (field, value) => {
    setFilters(current => ({ ...current, [field]: value }));
  };

  const handleUpvote = async issue => {
    const previousIssues = issues;
    const nextHasUpvoted = !issue.hasUpvoted;

    setVotingIssueId(issue._id);
    setIssues(current =>
      current.map(item =>
        item._id === issue._id
          ? {
              ...item,
              hasUpvoted: nextHasUpvoted,
              upvoteCount: item.upvoteCount + (nextHasUpvoted ? 1 : -1)
            }
          : item
      )
    );

    try {
      const response = await toggleIssueUpvote(issue._id);

      if (!response.success) {
        throw new Error(response.message || "Unable to update vote");
      }

      setIssues(current =>
        current.map(item =>
          item._id === issue._id
            ? {
                ...item,
                hasUpvoted: response.hasUpvoted,
                upvoteCount: response.totalUpvote
              }
            : item
        )
      );
    } catch (voteError) {
      setIssues(previousIssues);
      setError(voteError.message);
    } finally {
      setVotingIssueId("");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Issue feed"
        title="Nearby community issues"
        description="Browse issues reported around your current location, refine the feed with category and status filters, and upvote the ones that need immediate attention."
        actions={
          isAuthenticated ? (
            <Link to="/create">
              <Button>Create issue</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button>Login to contribute</Button>
            </Link>
          )
        }
      />

      <IssueFilters
        filters={filters}
        onChange={handleFilterChange}
        geoLoading={geoLoading}
        onRefreshLocation={requestLocation}
      />

      {geoError ? <ErrorState message={geoError} onRetry={requestLocation} /> : null}
      {error ? <ErrorState message={error} onRetry={fetchIssues} /> : null}
      {loading ? <LoadingState message="Fetching nearby issues..." /> : null}

      {!loading && !error && issues.length === 0 ? (
        <EmptyState
          title="No nearby issues yet"
          description="Nothing matched your current location and filters. Try expanding the search by refreshing your location or changing the filters."
          action={
            <Button variant="secondary" onClick={() => setFilters(defaultFilters)}>
              Reset filters
            </Button>
          }
        />
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {issues.map(issue => (
          <IssueCard
            key={issue._id}
            issue={issue}
            onUpvote={handleUpvote}
            canUpvote={isAuthenticated}
            voting={votingIssueId === issue._id}
          />
        ))}
      </section>
    </div>
  );
}
