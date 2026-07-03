import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../services/authService";
import { notify } from "../../../shared/utils/notify";

function friendlySignOutError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Sin conexión. Intenta cerrar sesión de nuevo.";
  }
  return message;
}

export function useSignOut() {
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

  return { handleSignOut, signingOut };
}