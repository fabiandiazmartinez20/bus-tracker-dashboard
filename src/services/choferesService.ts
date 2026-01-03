import api from "../lib/api";
import type { Chofer, CreateChoferData } from "../types";

export const choferesService = {
  // Listar todos los choferes
  getAll: async (): Promise<Chofer[]> => {
    const response = await api.get("/choferes");
    return response.data;
  },

  // Obtener un chofer
  getOne: async (id: number): Promise<Chofer> => {
    const response = await api.get(`/choferes/${id}`);
    return response.data;
  },

  // Crear chofer
  create: async (data: CreateChoferData) => {
    const response = await api.post("/choferes", data);
    return response.data;
  },

  // Actualizar chofer
  update: async (id: number, data: Partial<CreateChoferData>) => {
    const response = await api.patch(`/choferes/${id}`, data);
    return response.data;
  },

  // Activar/Desactivar chofer
  toggleActive: async (id: number, activo: boolean) => {
    const response = await api.patch(`/choferes/${id}`, { activo });
    return response.data;
  },

  // Desactivar chofer (deprecado, usar toggleActive)
  delete: async (id: number) => {
    const response = await api.delete(`/choferes/${id}`);
    return response.data;
  },

  // Eliminar permanentemente
  deletePermanently: async (id: number) => {
    const response = await api.delete(`/choferes/${id}/permanent`);
    return response.data;
  },
};
