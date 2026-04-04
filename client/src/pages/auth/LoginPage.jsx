import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import AuthFormLayout from "./AuthFormLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Welcome back"
      description="Sign in to report new issues, upvote important problems, and track the status of the cases you have already submitted."
      footerText="Need an account?"
      footerLink="/signup"
      footerLabel="Create one"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="label">Email</label>
          <input
            className="field"
            type="email"
            required
            value={form.email}
            onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            className="field"
            type="password"
            required
            value={form.password}
            onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
          />
        </div>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <div className="mt-8 rounded-3xl bg-mist p-4 text-sm text-ink/70">
        New here? <Link to="/signup" className="font-bold text-pine">Go to signup</Link>
      </div>
    </AuthFormLayout>
  );
}
