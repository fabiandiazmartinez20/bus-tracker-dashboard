import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Loader2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { choferesService } from "../../services/choferesService";

export default function ChoferesLista() {
  const navigate = useNavigate();
  const [choferes, setChoferes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarChoferes();
  }, []);

  const cargarChoferes = async () => {
    try {
      setLoading(true);
      const data = await choferesService.getAll();
      setChoferes(data);
    } catch (err) {
      console.error("Error cargando choferes:", err);
      setError("Error al cargar los choferes");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, activo: boolean) => {
    const accion = activo ? "desactivar" : "activar";
    if (!confirm(`¿Estás seguro de ${accion} este chofer?`)) return;

    try {
      await choferesService.toggleActive(id, !activo);
      cargarChoferes();
    } catch (err) {
      alert(`Error al ${accion} chofer`);
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (
      !confirm(
        "⚠️ ¿Estás seguro de ELIMINAR PERMANENTEMENTE este chofer? Esta acción no se puede deshacer."
      )
    )
      return;

    // Doble confirmación
    if (
      !confirm(
        "Esta es tu última oportunidad. ¿Realmente quieres eliminar permanentemente este chofer?"
      )
    )
      return;

    try {
      await choferesService.deletePermanently(id);
      cargarChoferes();
    } catch (err) {
      alert("Error al eliminar chofer permanentemente");
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
        <h1 className="text-3xl font-bold text-gray-800">Choferes</h1>
        <button
          onClick={() => navigate("/choferes/crear")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus size={20} />
          <span>Nuevo Chofer</span>
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
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bus Asignado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turno
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
            {choferes.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No hay choferes registrados
                </td>
              </tr>
            ) : (
              choferes.map((chofer) => (
                <tr key={chofer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {chofer.nombre} {chofer.apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chofer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chofer.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chofer.buses ? (
                      <span>
                        Bus {chofer.buses.numero} - {chofer.buses.ruta}
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chofer.turno || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        chofer.activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {chofer.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {/* Editar */}
                      <button
                        onClick={() =>
                          navigate(`/choferes/${chofer.id}/editar`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Activar/Desactivar */}
                      <button
                        onClick={() =>
                          handleToggleActive(chofer.id, chofer.activo)
                        }
                        className={
                          chofer.activo
                            ? "text-orange-600 hover:text-orange-900"
                            : "text-green-600 hover:text-green-900"
                        }
                        title={chofer.activo ? "Desactivar" : "Activar"}
                      >
                        {chofer.activo ? (
                          <XCircle size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </button>

                      {/* Eliminar permanentemente (solo si está inactivo) */}
                      {!chofer.activo && (
                        <button
                          onClick={() => handleDeletePermanently(chofer.id)}
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
