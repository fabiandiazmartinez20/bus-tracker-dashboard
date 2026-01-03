import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Users, Bus, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Layout() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">🚌 Bus Tracker</h1>
          <p className="text-sm text-gray-400 mt-1">Panel Admin</p>
          {user && <p className="text-xs text-gray-500 mt-2">{user.email}</p>}
        </div>

        <nav className="flex-1 px-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
              isActive("/dashboard")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/choferes"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
              isActive("/choferes")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Users size={20} />
            <span>Choferes</span>
          </Link>

          <Link
            to="/buses"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
              isActive("/buses")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Bus size={20} />
            <span>Buses</span>
          </Link>

          <Link
            to="/estadisticas"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
              isActive("/estadisticas")
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <BarChart3 size={20} />
            <span>Estadísticas</span>
          </Link>
        </nav>

        <div className="p-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Panel de Administración
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
