import { Injectable, signal, computed } from '@angular/core';
import { Docente } from '../models/docente.model';

export interface DocenteState {
  lista: Docente[];
  cargando: boolean;
  error: string | null;
  mensaje: string | null;
}

const initialState: DocenteState = {
  lista: [],
  cargando: false,
  error: null,
  mensaje: null
};

@Injectable({ providedIn: 'root' })
export class DocenteStore {
  private readonly state = signal<DocenteState>(initialState);

  readonly lista = computed(() => this.state().lista);
  readonly estaCargando = computed(() => this.state().cargando);
  readonly errorActual = computed(() => this.state().error);
  readonly mensajeActual = computed(() => this.state().mensaje);

  setCargando(cargando: boolean): void {
    this.state.update(s => ({ ...s, cargando, error: cargando ? null : s.error }));
  }

  setDocentes(docentes: Docente[]): void {
    this.state.update(s => ({ ...s, lista: docentes, cargando: false, error: null }));
  }

  agregar(docente: Docente): void {
    this.state.update(s => ({ ...s, lista: [...s.lista, docente] }));
  }

  actualizar(docente: Docente): void {
    this.state.update(s => ({
      ...s,
      lista: s.lista.map(d => (d.id === docente.id ? docente : d))
    }));
  }

  eliminar(id: number): void {
    this.state.update(s => ({
      ...s,
      lista: s.lista.filter(d => d.id !== id)
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
