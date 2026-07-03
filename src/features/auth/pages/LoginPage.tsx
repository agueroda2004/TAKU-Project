import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { signIn } from "../services/authService";
import {
  loginSchema,
  formatLoginErrors,
  type LoginFieldErrors,
} from "../schemas/loginSchema";
import { notify } from "../../../shared/utils/notify";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="font-comfortaa text-neutral-500">Cargando...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/projects" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(formatLoginErrors(result.error));
      return;
    }

    setSubmitting(true);

    try {
      await signIn({
        email: result.data.email,
        password: result.data.password,
      });
      notify.success("Sesión iniciada correctamente.");
      navigate("/projects", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? friendlyAuthError(err.message)
          : "No fue posible iniciar sesión.";
      notify.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function clearFieldError(field: keyof LoginFieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-secondary p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <h1 className="font-comfortaa mt-1 text-5xl font-bold tracking-[0.18em] text-primary">
              TAKU
            </h1>
            <span className="font-comfortaa text-[10px] font-semibold uppercase tracking-[0.5em] text-neutral-400">
              Project
            </span>
          </div>

          <div className="h-px w-10 bg-neutral-300" />

          <div className="flex flex-col items-center gap-1">
            <h2 className="font-comfortaa text-base font-semibold text-neutral-700">
              Bienvenido
            </h2>
            <p className="font-comfortaa text-sm text-neutral-500">
              Inicia sesión para continuar
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Correo electrónico
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                placeholder="tu@correo.com"
                aria-invalid={Boolean(fieldErrors.email)}
                className={`font-comfortaa w-full rounded-lg border bg-secondary py-2 pl-10 pr-3 text-sm text-primary outline-none transition focus:ring-2 ${
                  fieldErrors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-primary focus:ring-neutral-200"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="font-comfortaa mt-1 text-xs text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-comfortaa text-sm font-medium text-neutral-700">
              Contraseña
            </span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                placeholder="••••••••"
                aria-invalid={Boolean(fieldErrors.password)}
                className={`font-comfortaa w-full rounded-lg border bg-secondary py-2 pl-10 pr-10 text-sm text-primary outline-none transition focus:ring-2 ${
                  fieldErrors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-300 focus:border-primary focus:ring-neutral-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-primary"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="font-comfortaa mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="font-comfortaa mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-secondary shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (lower.includes("email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesión.";
  }
  if (lower.includes("rate limit")) {
    return "Demasiados intentos. Espera un momento y vuelve a intentar.";
  }
  return message;
}
