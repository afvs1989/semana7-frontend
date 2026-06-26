import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ROLES, UsuarioFormData } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly roles = ROLES;
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly esEdicion = signal(false);
  private usuarioId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    password: ['', [Validators.minLength(6)]],
    rol: ['Usuario' as (typeof ROLES)[number], Validators.required],
    activo: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion.set(true);
      this.usuarioId = Number(idParam);
      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
      void this.cargarUsuario(this.usuarioId);
    } else {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls.password.updateValueAndValidity();
    }
  }

  private async cargarUsuario(id: number): Promise<void> {
    const usuario = await this.usuarioService.obtenerPorId(id);
    if (!usuario) {
      this.error.set('Usuario no encontrado.');
      return;
    }

    this.form.patchValue({
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol as (typeof ROLES)[number],
      activo: usuario.activo
    });
  }

  mostrarError(campo: keyof UsuarioFormData): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    const { nombreUsuario, password, rol, activo } = this.form.getRawValue();

    const result = this.esEdicion() && this.usuarioId
      ? await this.usuarioService.actualizar(this.usuarioId, {
          nombreUsuario,
          password: password || undefined,
          rol,
          activo
        })
      : await this.usuarioService.crear({ nombreUsuario, password, rol, activo });

    this.enviando.set(false);

    if (result.ok) {
      await this.router.navigate(['/usuarios']);
      return;
    }

    this.error.set(result.error ?? 'Ocurrió un error inesperado.');
  }
}
