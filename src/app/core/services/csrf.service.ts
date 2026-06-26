import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private token: string | null = null;

  constructor(private readonly http: HttpClient) {}

  async obtenerToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    const response = await firstValueFrom(
      this.http.get<{ token: string }>(`${environment.apiUrl}/csrf/token`, {
        withCredentials: true
      })
    );

    this.token = response.token;
    return this.token;
  }

  limpiarToken(): void {
    this.token = null;
  }
}
