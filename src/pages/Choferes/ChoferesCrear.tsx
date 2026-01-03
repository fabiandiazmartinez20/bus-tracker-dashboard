import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { choferesService } from "../../services/choferesService";
import { busesService } from "../../services/busesService";
import type { Bus } from "../../types/index";

export default function ChoferCrear() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    busAsignado: "",
    turno: "",
  });

  // Cargar buses disponibles
  useEffect(() => {
    cargarBuses();
  }, []);

  const cargarBuses = async () => {
    try {
      const data = await busesService.getAll();
      setBuses(data.filter((bus) => bus.activo));
    } catch (err) {
      console.error("Error cargando buses:", err);
      setError("Error al cargar los buses disponibles");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await choferesService.create({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        busAsignado: parseInt(formData.busAsignado),
        turno: formData.turno || undefined,
      });

      console.log("Chofer creado:", response);

      // Mostrar mensaje con contraseña temporal
      setSuccess(
        `¡Chofer registrado exitosamente!\n\n` +
          `Se ha enviado un email a ${formData.email} con las credenciales.\n\n` +
          `Contraseña temporal (solo para desarrollo): ${response.passwordTemporal}` +
          `favor de verificar en el apartado de spam.`
      );

      // Regresar a la lista después de 5 segundos
      setTimeout(() => {
        navigate("/choferes");
      }, 5000);
    } catch (err: any) {
      console.error("Error creando chofer:", err);
      const errorMessage =
        err.response?.data?.message || "Error al registrar chofer";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate("/choferes")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Volver a Choferes</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Registrar Nuevo Chofer
        </h1>

        {/* Mensajes */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 whitespace-pre-line">
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Juan"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                required
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pérez"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="juan.perez@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5551234567"
                disabled={loading}
              />
            </div>
          </div>

          {/* Bus y Turno */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bus Asignado *
              </label>
              <select
                required
                value={formData.busAsignado}
                onChange={(e) =>
                  setFormData({ ...formData, busAsignado: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Seleccionar bus...</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    Bus {bus.numero} - {bus.ruta}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turno
              </label>
              <select
                value={formData.turno}
                onChange={(e) =>
                  setFormData({ ...formData, turno: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Seleccionar turno...</option>
                <option value="matutino">Matutino</option>
                <option value="vespertino">Vespertino</option>
                <option value="nocturno">Nocturno</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Registrar Chofer</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/choferes")}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
