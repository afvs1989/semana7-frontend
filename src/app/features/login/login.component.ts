import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthStore } from '../../core/state/auth.store';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);

  readonly enviando = signal(false);
  readonly sesionExpirada = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.sesionExpirada.set(this.route.snapshot.queryParamMap.get('sesionExpirada') === '1');
  }

  get nombreUsuarioInvalido(): boolean {
    const control = this.form.controls.nombreUsuario;
    return control.invalid && (control.dirty || control.touched);
  }

  get passwordInvalido(): boolean {
    const control = this.form.controls.password;
    return control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.authStore.limpiarError();

    const { nombreUsuario, password } = this.form.getRawValue();
    await this.authService.login(nombreUsuario, password);
    this.enviando.set(false);
  }
}
