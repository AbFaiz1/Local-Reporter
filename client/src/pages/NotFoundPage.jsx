import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you are looking for does not exist."
      action={
        <Link to="/">
          <Button>Back to feed</Button>
        </Link>
      }
    />
  );
}
