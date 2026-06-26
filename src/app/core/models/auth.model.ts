export interface AuthStatus {
  autenticado: boolean;
  nombreUsuario: string | null;
  rol: string | null;
}

export interface LoginResponse {
  nombreUsuario: string;
  rol: string;
}

export interface AuthState {
  autenticado: boolean;
  nombreUsuario: string | null;
  rol: string | null;
  cargando: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  autenticado: false,
  nombreUsuario: null,
  rol: null,
  cargando: true,
  error: null
};
