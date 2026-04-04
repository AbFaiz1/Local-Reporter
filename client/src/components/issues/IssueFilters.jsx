const categories = ["all", "road", "water", "electricity", "other"];
const statuses = ["all", "pending", "in-progress", "resolved"];
const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "distance", label: "Nearest" },
  { value: "upvotes", label: "Most upvoted" }
];

export default function IssueFilters({ filters, onChange, geoLoading, onRefreshLocation }) {
  return (
    <section className="surface grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-[2fr,1fr,1fr,1fr,auto]">
      <div>
        <label className="label">Search issues</label>
        <input
          className="field"
          placeholder="Search description..."
          value={filters.search}
          onChange={event => onChange("search", event.target.value)}
        />
      </div>

      <div>
        <label className="label">Category</label>
        <select
          className="field"
          value={filters.category}
          onChange={event => onChange("category", event.target.value)}
        >
          {categories.map(option => (
            <option key={option} value={option}>
              {option === "all" ? "All categories" : option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Status</label>
        <select
          className="field"
          value={filters.status}
          onChange={event => onChange("status", event.target.value)}
        >
          {statuses.map(option => (
            <option key={option} value={option}>
              {option === "all" ? "All status" : option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Sort by</label>
        <select
          className="field"
          value={filters.sortBy}
          onChange={event => onChange("sortBy", event.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onRefreshLocation}
          className="w-full rounded-2xl bg-sand px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand/80"
        >
          {geoLoading ? "Locating..." : "Refresh location"}
        </button>
      </div>
    </section>
  );
}
