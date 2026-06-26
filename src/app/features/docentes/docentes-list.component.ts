import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DocenteService } from '../../core/services/docente.service';
import { DocenteStore } from '../../core/state/docente.store';
import { ExportService } from '../../core/services/export.service';
import { AuthStore } from '../../core/state/auth.store';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-docentes-list',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './docentes-list.component.html',
  styleUrl: './docentes-list.component.css'
})
export class DocentesListComponent implements OnInit {
  private readonly docenteService = inject(DocenteService);
  readonly docenteStore = inject(DocenteStore);
  private readonly exportService = inject(ExportService);
  readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  readonly eliminandoId = signal<number | null>(null);

  ngOnInit(): void {
    void this.docenteService.cargarDocentes();
  }

  async eliminar(id: number): Promise<void> {
    if (!confirm('¿Está seguro de eliminar este docente?')) {
      return;
    }

    this.eliminandoId.set(id);
    const result = await this.docenteService.eliminar(id);
    if (!result.ok && result.error) {
      alert(result.error);
    }
    this.eliminandoId.set(null);
  }

  exportarCsv(): void {
    this.exportService.exportarCsv(this.docenteStore.lista());
  }

  exportarExcel(): void {
    this.exportService.exportarExcel(this.docenteStore.lista());
  }

  exportarPdf(): void {
    this.exportService.exportarPdf(this.docenteStore.lista());
  }

  logout(): void {
    void this.authService.logout();
  }
}
