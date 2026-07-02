import { LayoutDashboard } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-secondary p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-neutral-100 p-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-comfortaa text-xl font-bold text-primary">
                Dashboard
              </h1>
              <p className="font-comfortaa text-sm text-neutral-500">
                Bienvenido,{" "}
                <span className="font-medium text-primary">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center">
            <p className="font-comfortaa text-sm text-neutral-500">
              Esta es una página placeholder. Aquí irá el contenido principal
              de la aplicación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}