import * as React from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate as useRouterNavigate,
} from "react-router-dom";

import { Icons } from "@/lib/icons";
import { apiFetch, clearSessionToken, getSessionToken, setUnauthorizedHandler } from "@/lib/api";
import SignUp from "@/screens/SignUp";
import SignIn from "@/screens/SignIn";
import Dashboard from "@/screens/Dashboard";
import Expenses from "@/screens/Expenses";
import CategoriesBudgets from "@/screens/CategoriesBudgets";
import Settings from "@/screens/Settings";

// The key the sign-in screen checks, once, to show the "your session has expired,
// sign in again" notice after a redirect the app itself triggered (AC-007). It is
// cleared the moment the sign-in screen has read it.
export const SESSION_EXPIRED_KEY = "session_expired_notice";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

type Me = { id: string; email: string; created_at: string };

// The app's menu, drawn around every screen except the ones routed outside it below.
// Also the route guard for every screen it wraps (AC-009): no child route renders
// until a token exists and GET /me has confirmed it, and either failure sends the
// visitor to /sign-in before any account data is drawn.
function AppShellLayout() {
  const navigate = useRouterNavigate();
  const [me, setMe] = React.useState<Me | null>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const token = getSessionToken();
    if (!token) {
      navigate("/sign-in");
      return;
    }
    apiFetch<Me>("/me")
      .then((profile) => {
        if (active) {
          setMe(profile);
          setChecked(true);
        }
      })
      .catch(() => {
        if (active) navigate("/sign-in");
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSignOut() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Already invalid or unreachable: sign the user out locally regardless.
    } finally {
      clearSessionToken();
      navigate("/sign-in");
    }
  }

  if (!checked || !me) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <div className="flex items-center gap-6 px-6 py-2">
          <p
            className="shrink-0 text-sm font-semibold"
            style={{ fontFamily: "var(--brand-font-heading)" }}
          >
            {"Expense Tracker"}
          </p>
          <nav aria-label="App menu" className="flex flex-wrap items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <Icons.Home size={16} />
              {"Dashboard"}
            </NavLink>
            <NavLink to="/expenses" className={navLinkClass}>
              {"Expenses"}
            </NavLink>
            <NavLink to="/categories-budgets" className={navLinkClass}>
              {"Categories & budgets"}
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              <Icons.Settings size={16} />
              {"Settings"}
            </NavLink>
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="text-sm text-[var(--brand-fg-muted)]">{me.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium text-[var(--brand-fg-muted)] hover:bg-[var(--brand-hover)] hover:text-[var(--brand-fg)]"
            >
              {"Sign out"}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const navigate = useRouterNavigate();

  React.useEffect(() => {
    setUnauthorizedHandler(() => {
      try {
        sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
      } catch {
        // No storage: the screen just won't show the notice.
      }
      navigate("/sign-in");
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/categories-budgets" element={<CategoriesBudgets />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/sign-up" replace />} />
    </Routes>
  );
}
