import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DEPARTAMENTOS, DocenteFormData } from '../../core/models/docente.model';
import { DocenteService } from '../../core/services/docente.service';

@Component({
  selector: 'app-docente-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './docente-form.component.html',
  styleUrl: './docente-form.component.css'
})
export class DocenteFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly docenteService = inject(DocenteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly departamentos = DEPARTAMENTOS;
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly esEdicion = signal(false);
  private docenteId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    documento: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    telefono: ['', [Validators.maxLength(20)]],
    departamento: [DEPARTAMENTOS[0] as string, Validators.required],
    tituloAcademico: ['', [Validators.maxLength(80)]],
    fechaContratacion: ['', Validators.required],
    salario: [0, [Validators.required, Validators.min(0)]],
    activo: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion.set(true);
      this.docenteId = Number(idParam);
      void this.cargarDocente(this.docenteId);
    }
  }

  private async cargarDocente(id: number): Promise<void> {
    const docente = await this.docenteService.obtenerPorId(id);
    if (!docente) {
      this.error.set('Docente no encontrado.');
      return;
    }

    this.form.patchValue({
      nombres: docente.nombres,
      apellidos: docente.apellidos,
      documento: docente.documento,
      email: docente.email,
      telefono: docente.telefono,
      departamento: docente.departamento,
      tituloAcademico: docente.tituloAcademico,
      fechaContratacion: docente.fechaContratacion?.slice(0, 10) ?? '',
      salario: docente.salario,
      activo: docente.activo
    });
  }

  mostrarError(campo: keyof DocenteFormData): boolean {
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

    const data = this.form.getRawValue();

    const result = this.esEdicion() && this.docenteId
      ? await this.docenteService.actualizar(this.docenteId, data)
      : await this.docenteService.crear(data);

    this.enviando.set(false);

    if (result.ok) {
      await this.router.navigate(['/docentes']);
      return;
    }

    this.error.set(result.error ?? 'Ocurrió un error inesperado.');
  }
}
