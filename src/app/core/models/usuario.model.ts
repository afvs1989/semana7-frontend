export interface Usuario {
  id: number;
  nombreUsuario: string;
  rol: string;
  activo: boolean;
}

export const ROLES = ['Administrador', 'Usuario'] as const;

export type Rol = (typeof ROLES)[number];

export interface UsuarioFormData {
  nombreUsuario: string;
  password: string;
  rol: Rol;
  activo: boolean;
}

export interface UsuarioUpdateData {
  nombreUsuario: string;
  password?: string;
  rol: Rol;
  activo: boolean;
}
