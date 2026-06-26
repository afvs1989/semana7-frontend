import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioFormData, UsuarioUpdateData } from '../models/usuario.model';
import { UsuarioStore } from '../state/usuario.store';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(
    private readonly http: HttpClient,
    private readonly usuarioStore: UsuarioStore
  ) {}

  async cargarUsuarios(): Promise<void> {
    this.usuarioStore.setCargando(true);
    try {
      const usuarios = await firstValueFrom(
        this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`, {
          withCredentials: true
        })
      );
      this.usuarioStore.setUsuarios(usuarios);
    } catch (error: unknown) {
      this.usuarioStore.setError(this.extraerMensaje(error, 'No se pudieron cargar los usuarios.'));
    }
  }

  async obtenerPorId(id: number): Promise<Usuario | null> {
    try {
      return await firstValueFrom(
        this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`, {
          withCredentials: true
        })
      );
    } catch {
      return null;
    }
  }

  async crear(data: UsuarioFormData): Promise<{ ok: boolean; error?: string }> {
    try {
      const usuario = await firstValueFrom(
        this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, data, {
          withCredentials: true
        })
      );
      this.usuarioStore.agregar(usuario);
      this.usuarioStore.setMensaje('Usuario creado correctamente.');
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: this.extraerMensaje(error, 'Error al crear el usuario.') };
    }
  }

  async actualizar(id: number, data: UsuarioUpdateData): Promise<{ ok: boolean; error?: string }> {
    try {
      const usuario = await firstValueFrom(
        this.http.put<Usuario>(`${environment.apiUrl}/usuarios/${id}`, data, {
          withCredentials: true
        })
      );
      this.usuarioStore.actualizar(usuario);
      this.usuarioStore.setMensaje('Usuario actualizado correctamente.');
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: this.extraerMensaje(error, 'Error al actualizar el usuario.') };
    }
  }

  async eliminar(id: number): Promise<{ ok: boolean; error?: string }> {
    try {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/usuarios/${id}`, {
          withCredentials: true
        })
      );
      this.usuarioStore.eliminar(id);
      this.usuarioStore.setMensaje('Usuario eliminado correctamente.');
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: this.extraerMensaje(error, 'Error al eliminar el usuario.') };
    }
  }

  private extraerMensaje(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const body = (error as { error?: { message?: string } }).error;
      if (body?.message) {
        return body.message;
      }
    }
    return fallback;
  }
}
