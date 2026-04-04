export const formatDistance = value => {
  if (value == null) {
    return "Unknown distance";
  }

  if (value < 1000) {
    return `${value} m away`;
  }

  return `${(value / 1000).toFixed(1)} km away`;
};

export const formatDate = value =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));

export const statusClasses = {
  pending: "bg-amber-100 text-amber-800",
  "in-progress": "bg-sky-100 text-sky-800",
  resolved: "bg-emerald-100 text-emerald-800"
};
