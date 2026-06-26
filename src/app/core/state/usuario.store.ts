import { Injectable, signal, computed } from '@angular/core';

export interface UsuarioState {
  lista: import('../models/usuario.model').Usuario[];
  cargando: boolean;
  error: string | null;
  mensaje: string | null;
}

const initialState: UsuarioState = {
  lista: [],
  cargando: false,
  error: null,
  mensaje: null
};

@Injectable({ providedIn: 'root' })
export class UsuarioStore {
  private readonly state = signal<UsuarioState>(initialState);

  readonly lista = computed(() => this.state().lista);
  readonly estaCargando = computed(() => this.state().cargando);
  readonly errorActual = computed(() => this.state().error);
  readonly mensajeActual = computed(() => this.state().mensaje);

  setCargando(cargando: boolean): void {
    this.state.update(s => ({ ...s, cargando, error: cargando ? null : s.error }));
  }

  setUsuarios(usuarios: UsuarioState['lista']): void {
    this.state.update(s => ({ ...s, lista: usuarios, cargando: false, error: null }));
  }

  agregar(usuario: UsuarioState['lista'][number]): void {
    this.state.update(s => ({ ...s, lista: [...s.lista, usuario] }));
  }

  actualizar(usuario: UsuarioState['lista'][number]): void {
    this.state.update(s => ({
      ...s,
      lista: s.lista.map(u => (u.id === usuario.id ? usuario : u))
    }));
  }

  eliminar(id: number): void {
    this.state.update(s => ({
      ...s,
      lista: s.lista.filter(u => u.id !== id)
    }));
  }

  setError(error: string): void {
    this.state.update(s => ({ ...s, error, cargando: false }));
  }

  setMensaje(mensaje: string): void {
    this.state.update(s => ({ ...s, mensaje }));
  }

  limpiarMensaje(): void {
    this.state.update(s => ({ ...s, mensaje: null }));
  }
}
