import api from "../lib/api";

export interface DashboardStats {
  totalChoferes: number;
  choferesActivos: number;
  totalBuses: number;
  busesActivos: number;
  busesEnRuta: number;
}

export const dashboardService = {
  // Obtener estadísticas generales
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  // Obtener últimos choferes registrados
  getRecentChoferes: async () => {
    const response = await api.get("/dashboard/recent-choferes");
    return response.data;
  },

  // Obtener buses activos
  getActiveBuses: async () => {
    const response = await api.get("/dashboard/active-buses");
    return response.data;
  },
};
