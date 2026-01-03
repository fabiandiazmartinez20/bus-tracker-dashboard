import { useEffect, useState } from "react";
import { Users, Bus, Activity, TrendingUp, Loader2 } from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalChoferes: number;
  choferesActivos: number;
  totalBuses: number;
  busesActivos: number;
  busesEnRuta: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalChoferes: 0,
    choferesActivos: 0,
    totalBuses: 0,
    busesActivos: 0,
    busesEnRuta: 0,
  });
  const [recentChoferes, setRecentChoferes] = useState<any[]>([]);
  const [activeBuses, setActiveBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [statsData, choferesData, busesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentChoferes(),
        dashboardService.getActiveBuses(),
      ]);

      setStats(statsData);
      setRecentChoferes(choferesData);
      setActiveBuses(busesData);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Choferes"
          value={stats.totalChoferes}
          subtitle={`${stats.choferesActivos} activos`}
          icon={<Users className="text-blue-500" size={40} />}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
          onClick={() => navigate("/choferes")}
        />

        <StatsCard
          title="Choferes Activos"
          value={stats.choferesActivos}
          subtitle={`de ${stats.totalChoferes} totales`}
          icon={<Activity className="text-green-500" size={40} />}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />

        <StatsCard
          title="Total Buses"
          value={stats.totalBuses}
          subtitle={`${stats.busesActivos} activos`}
          icon={<Bus className="text-purple-500" size={40} />}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
          onClick={() => navigate("/buses")}
        />

        <StatsCard
          title="Buses en Ruta"
          value={stats.busesEnRuta}
          subtitle="En servicio ahora"
          icon={<TrendingUp className="text-orange-500" size={40} />}
          bgColor="bg-orange-50"
          textColor="text-orange-600"
        />
      </div>

      {/* Secciones inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Choferes recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Últimos Choferes Registrados
            </h2>
            <button
              onClick={() => navigate("/choferes")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todos →
            </button>
          </div>
          <div className="space-y-3">
            {recentChoferes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay choferes registrados
              </p>
            ) : (
              recentChoferes.map((chofer) => (
                <div
                  key={chofer.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {chofer.nombre} {chofer.apellido}
                    </p>
                    <p className="text-sm text-gray-500">{chofer.email}</p>
                    {chofer.buses && (
                      <p className="text-xs text-gray-400">
                        Bus {chofer.buses.numero} - {chofer.buses.ruta}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      chofer.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {chofer.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Buses activos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Buses Activos
            </h2>
            <button
              onClick={() => navigate("/buses")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todos →
            </button>
          </div>
          <div className="space-y-3">
            {activeBuses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay buses activos
              </p>
            ) : (
              activeBuses.slice(0, 5).map((bus) => (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white font-bold text-sm rounded-lg w-10 h-10 flex items-center justify-center">
                      {bus.numero}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bus.ruta}</p>
                      <p className="text-sm text-gray-500">{bus.placa}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {bus.capacidad ? `${bus.capacidad} pasajeros` : "-"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Card de Estadísticas
interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
  bgColor,
  textColor,
  onClick,
}: StatsCardProps) {
  return (
    <div
      className={`${bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}
