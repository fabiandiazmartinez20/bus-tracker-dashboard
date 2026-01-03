import api from "../lib/api";
import type { Bus } from "../types";

export interface CreateBusData {
  numero: string;
  ruta: string;
  placa: string;
  modelo?: string;
  color?: string;
  capacidad?: number;
}

export const busesService = {
  // Listar todos los buses
  getAll: async (): Promise<Bus[]> => {
    const response = await api.get("/buses");
    return response.data;
  },

  // Obtener un bus
  getOne: async (id: number): Promise<Bus> => {
    const response = await api.get(`/buses/${id}`);
    return response.data;
  },

  // Crear bus
  create: async (data: CreateBusData) => {
    const response = await api.post("/buses", data);
    return response.data;
  },

  // Actualizar bus
  update: async (id: number, data: Partial<CreateBusData>) => {
    const response = await api.patch(`/buses/${id}`, data);
    return response.data;
  },

  // Activar/Desactivar bus
  toggleActive: async (id: number, activo: boolean) => {
    const response = await api.patch(`/buses/${id}`, { activo });
    return response.data;
  },

  // Desactivar bus (deprecado, usar toggleActive)
  delete: async (id: number) => {
    const response = await api.delete(`/buses/${id}`);
    return response.data;
  },

  // Eliminar permanentemente
  deletePermanently: async (id: number) => {
    const response = await api.delete(`/buses/${id}/permanent`);
    return response.data;
  },
};
