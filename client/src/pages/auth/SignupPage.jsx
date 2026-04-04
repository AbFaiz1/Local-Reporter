import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import AuthFormLayout from "./AuthFormLayout";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(form);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Create your account"
      description="Join the local reporting network to submit issues with media, contribute context in comments, and help surface the most urgent community problems."
      footerText="Already registered?"
      footerLink="/login"
      footerLabel="Login instead"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="label">Username</label>
          <input
            className="field"
            required
            value={form.username}
            onChange={event => setForm(current => ({ ...current, username: event.target.value }))}
          />
        </div>

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
            minLength={6}
            value={form.password}
            onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
          />
        </div>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
