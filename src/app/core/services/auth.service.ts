import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthStatus, LoginResponse } from '../models/auth.model';
import { AuthStore } from '../state/auth.store';
import { CsrfService } from './csrf.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly authStore: AuthStore,
    private readonly csrfService: CsrfService,
    private readonly router: Router
  ) {}

  async verificarSesion(): Promise<void> {
    this.authStore.setCargando(true);
    try {
      const status = await firstValueFrom(
        this.http.get<AuthStatus>(`${environment.apiUrl}/auth/status`, {
          withCredentials: true
        })
      );

      if (status.autenticado && status.nombreUsuario && status.rol) {
        this.authStore.setAutenticado(status.nombreUsuario, status.rol);
      } else {
        this.authStore.setNoAutenticado();
      }
    } catch {
      this.authStore.setNoAutenticado();
    }
  }

  async login(nombreUsuario: string, password: string): Promise<boolean> {
    this.authStore.limpiarError();
    this.authStore.setCargando(true);

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.apiUrl}/auth/login`,
          { nombreUsuario, password },
          { withCredentials: true }
        )
      );

      this.csrfService.limpiarToken();
      await this.csrfService.obtenerToken();
      this.authStore.setAutenticado(response.nombreUsuario, response.rol);
      await this.router.navigate(['/inicio']);
      return true;
    } catch (error: unknown) {
      const mensaje = this.extraerMensaje(error, 'Credenciales inválidas. Intente nuevamente.');
      this.authStore.setError(mensaje);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      );
    } finally {
      this.csrfService.limpiarToken();
      this.authStore.setNoAutenticado();
      await this.router.navigate(['/login']);
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
