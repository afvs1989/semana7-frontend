import { Injectable, signal, computed } from '@angular/core';
import { AuthState, initialAuthState } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly state = signal<AuthState>(initialAuthState);

  readonly autenticado = computed(() => this.state().autenticado);
  readonly nombreUsuario = computed(() => this.state().nombreUsuario);
  readonly rol = computed(() => this.state().rol);
  readonly cargando = computed(() => this.state().cargando);
  readonly error = computed(() => this.state().error);
  readonly esAdministrador = computed(() => this.state().rol === 'Administrador');

  setCargando(cargando: boolean): void {
    this.state.update(s => ({ ...s, cargando }));
  }

  setAutenticado(nombreUsuario: string, rol: string): void {
    this.state.set({
      autenticado: true,
      nombreUsuario,
      rol,
      cargando: false,
      error: null
    });
  }

  setNoAutenticado(): void {
    this.state.set({
      autenticado: false,
      nombreUsuario: null,
      rol: null,
      cargando: false,
      error: null
    });
  }

  setError(error: string): void {
    this.state.update(s => ({ ...s, error, cargando: false }));
  }

  limpiarError(): void {
    this.state.update(s => ({ ...s, error: null }));
  }
}
