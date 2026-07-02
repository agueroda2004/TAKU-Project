import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./features/auth/hooks/useAuth";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/auth/pages/DashboardPage";
import ProjectsPage from "./features/project/pages/ProjectsPage";
import ProjectDetailPage from "./features/project/pages/ProjectDetailPage";
import ProjectModulesPage from "./features/module/pages/ProjectModulesPage";
import ModuleDetailPage from "./features/module/pages/ModuleDetailPage";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import AppLayout from "./shared/components/AppLayout";

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="font-comfortaa text-neutral-500">Cargando...</div>
      </div>
    );
  }

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId/modules"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectModulesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId/modules/:moduleId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ModuleDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}