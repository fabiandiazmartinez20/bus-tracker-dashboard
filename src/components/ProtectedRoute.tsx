import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  console.log("🛡️ ProtectedRoute - Estado:", {
    loading,
    hasUser: !!user,
    userEmail: user?.email,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("❌ No hay usuario, redirigiendo a login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Usuario autenticado, mostrando contenido");
  return <>{children}</>;
}
