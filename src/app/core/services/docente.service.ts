import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Docente, DocenteFormData } from '../models/docente.model';
import { DocenteStore } from '../state/docente.store';

@Injectable({ providedIn: 'root' })
export class DocenteService {
  constructor(
    private readonly http: HttpClient,
    private readonly docenteStore: DocenteStore
  ) {}

  async cargarDocentes(): Promise<void> {
    this.docenteStore.setCargando(true);
    try {
      const docentes = await firstValueFrom(
        this.http.get<Docente[]>(`${environment.apiUrl}/docentes`, {
          withCredentials: true
        })
      );
      this.docenteStore.setDocentes(docentes);
    } catch (error: unknown) {
      this.docenteStore.setError(this.extraerMensaje(error, 'No se pudieron cargar los docentes.'));
    }
  }

  async obtenerPorId(id: number): Promise<Docente | null> {
    try {
      return await firstValueFrom(
        this.http.get<Docente>(`${environment.apiUrl}/docentes/${id}`, {
          withCredentials: true
        })
      );
    } catch {
      return null;
    }
  }

  async crear(data: DocenteFormData): Promise<{ ok: boolean; error?: string }> {
    try {
      const docente = await firstValueFrom(
        this.http.post<Docente>(`${environment.apiUrl}/docentes`, data, {
          withCredentials: true
        })
      );
      this.docenteStore.agregar(docente);
      this.docenteStore.setMensaje('Docente creado correctamente.');
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: this.extraerMensaje(error, 'Error al crear el docente.') };
    }
  }

  async actualizar(id: number, data: DocenteFormData): Promise<{ ok: boolean; error?: string }> {
    try {
      const docente = await firstValueFrom(
        this.http.put<Docente>(`${environment.apiUrl}/docentes/${id}`, data, {
          withCredentials: true
        })
      );
      this.docenteStore.actualizar(docente);
      this.docenteStore.setMensaje('Docente actualizado correctamente.');
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: this.extraerMensaje(error, 'Error al actualizar el docente.') };
    }
  }

  async eliminar(id: number): Promise<{ ok: boolean; error?: string }> {
    try {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/docentes/${id}`, {
          withCredentials: true
        })
      );
      this.docenteStore.eliminar(id);
      this.docenteStore.setMensaje('Docente eliminado correctamente.');
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: this.extraerMensaje(error, 'Error al eliminar el docente.') };
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
