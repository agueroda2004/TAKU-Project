import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  UserCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { signOut } from "../../features/auth/services/authService";
import { notify } from "../utils/notify";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Proyectos", icon: FolderKanban },
] as const;

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      notify.success("Sesión cerrada correctamente.");
      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? friendlySignOutError(err.message)
          : "No fue posible cerrar la sesión.";
      notify.error(message);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-secondary sticky top-0 h-screen">
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <span className="font-comfortaa text-lg font-bold tracking-wide text-primary">
          TAKU-Project
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `font-comfortaa flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-neutral-100 text-primary"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-primary"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-neutral-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="rounded-full bg-neutral-100 p-2">
            <UserCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-comfortaa truncate text-xs text-neutral-500">
              Sesión activa
            </p>
            <p
              className="font-comfortaa truncate text-sm font-medium text-primary"
              title={user?.email}
            >
              {user?.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="font-comfortaa mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-secondary px-3 py-2 text-sm font-medium text-primary transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {signingOut ? "Cerrando..." : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}

function friendlySignOutError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Sin conexión. Intenta cerrar sesión de nuevo.";
  }
  return message;
}
