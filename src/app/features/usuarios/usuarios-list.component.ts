import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioStore } from '../../core/state/usuario.store';
import { AuthStore } from '../../core/state/auth.store';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-usuarios-list',
  imports: [RouterLink],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.css'
})
export class UsuariosListComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  readonly usuarioStore = inject(UsuarioStore);
  readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  readonly eliminandoId = signal<number | null>(null);

  ngOnInit(): void {
    void this.usuarioService.cargarUsuarios();
  }

  async eliminar(id: number): Promise<void> {
    if (!confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    this.eliminandoId.set(id);
    const result = await this.usuarioService.eliminar(id);
    if (!result.ok && result.error) {
      alert(result.error);
    }
    this.eliminandoId.set(null);
  }

  logout(): void {
    void this.authService.logout();
  }
}
