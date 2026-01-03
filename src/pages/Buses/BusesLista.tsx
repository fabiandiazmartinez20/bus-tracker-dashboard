import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { busesService } from "../../services/busesService";
import type { Bus } from "../../types";

export default function BusesLista() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarBuses();
  }, []);

  const cargarBuses = async () => {
    try {
      setLoading(true);
      const data = await busesService.getAll();
      setBuses(data);
    } catch (err) {
      console.error("Error cargando buses:", err);
      setError("Error al cargar los buses");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, activo: boolean) => {
    const accion = activo ? "desactivar" : "activar";
    if (!confirm(`¿Estás seguro de ${accion} este bus?`)) return;

    try {
      await busesService.toggleActive(id, !activo);
      cargarBuses();
    } catch (err) {
      alert(`Error al ${accion} bus`);
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (
      !confirm(
        "⚠️ ¿Estás seguro de ELIMINAR PERMANENTEMENTE este bus? Esta acción no se puede deshacer."
      )
    )
      return;

    // Doble confirmación
    if (
      !confirm(
        "Esta es tu última oportunidad. ¿Realmente quieres eliminar permanentemente este bus?"
      )
    )
      return;

    try {
      await busesService.deletePermanently(id);
      cargarBuses();
    } catch (err) {
      alert("Error al eliminar bus permanentemente");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Buses</h1>
        <button
          onClick={() => navigate("/buses/crear")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Nuevo Bus</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ruta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Placa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buses.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No hay buses registrados
                </td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-lg text-blue-600">
                      {bus.numero}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{bus.ruta}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.placa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.modelo || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.color || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.capacidad ? `${bus.capacidad} pasajeros` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bus.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bus.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {/* Editar */}
                      <button
                        onClick={() => navigate(`/buses/${bus.id}/editar`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Activar/Desactivar */}
                      <button
                        onClick={() => handleToggleActive(bus.id, bus.activo)}
                        className={
                          bus.activo
                            ? "text-orange-600 hover:text-orange-900"
                            : "text-green-600 hover:text-green-900"
                        }
                        title={bus.activo ? "Desactivar" : "Activar"}
                      >
                        {bus.activo ? (
                          <XCircle size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </button>

                      {/* Eliminar permanentemente (solo si está inactivo) */}
                      {!bus.activo && (
                        <button
                          onClick={() => handleDeletePermanently(bus.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
