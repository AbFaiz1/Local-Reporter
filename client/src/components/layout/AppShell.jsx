import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/", label: "Feed" },
  { to: "/create", label: "Create" },
  { to: "/dashboard", label: "Dashboard" }
];

export default function AppShell({ children }) {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-mist/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-extrabold text-white">
              LR
            </div>
            <div>
              <p className="text-base font-extrabold tracking-tight text-ink">Local Reporter</p>
              <p className="text-xs text-ink/60">Community issue reporting dashboard</p>
            </div>
          </Link>

          {!isAuthPage ? (
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive ? "bg-ink text-white" : "text-ink/65 hover:bg-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-ink">{user?.username || "Reporter"}</p>
                  <p className="text-xs text-ink/55">{user?.email}</p>
                </div>
                <Button variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
