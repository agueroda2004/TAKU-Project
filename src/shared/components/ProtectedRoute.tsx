import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="font-comfortaa text-neutral-500">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}