import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Loader2,
  LogOut,
  Menu,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useSignOut } from "../../features/auth/hooks/useSignOut";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleSignOut, signingOut } = useSignOut();

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  function close() {
    setIsOpen(false);
  }

  function navigateTo(path: string) {
    return (event: ReactMouseEvent) => {
      event.preventDefault();
      close();
      navigate(path);
    };
  }

  function handleSignOutClick(event: ReactMouseEvent) {
    event.preventDefault();
    if (signingOut) return;
    close();
    void handleSignOut();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Abrir menú de usuario"
        title="Menú"
        className="font-comfortaa inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-secondary text-primary transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200"
      >
        <Menu className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="font-comfortaa absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-secondary shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={navigateTo("/projects")}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary transition hover:bg-neutral-50"
          >
            <FolderKanban className="h-4 w-4 shrink-0 text-neutral-500" />
            Proyectos
          </button>

          <div className="border-t border-neutral-200 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="shrink-0 rounded-full bg-neutral-100 p-1.5">
                <UserCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] uppercase tracking-wide text-neutral-500">
                  Sesión activa
                </p>
                <p
                  className="truncate text-xs font-medium text-primary"
                  title={user?.email}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOutClick}
              disabled={signingOut}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary transition hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signingOut ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 shrink-0" />
              )}
              {signingOut ? "Cerrando..." : "Cerrar sesión"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}