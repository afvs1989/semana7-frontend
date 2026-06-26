import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/state/auth.store';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  logout(): void {
    void this.authService.logout();
  }
}
