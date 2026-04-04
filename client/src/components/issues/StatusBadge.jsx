import { statusClasses } from "../../utils/format";

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClasses[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
