export interface Bus {
  id: number;
  numero: string;
  ruta: string;
  placa: string;
  modelo?: string;
  color?: string;
  capacidad?: number;
  activo: boolean;
}

export interface Chofer {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  turno: string | null;
  activo: boolean;
  bus_asignado_id?: number | null;
  buses?: Bus;
  created_at: string;
}

export interface CreateChoferData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  busAsignado: number;
  turno?: string;
}
