import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Docente } from '../models/docente.model';

interface Columna {
  header: string;
  valor: (d: Docente) => string;
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly columnas: Columna[] = [
    { header: 'Nombres', valor: d => d.nombres },
    { header: 'Apellidos', valor: d => d.apellidos },
    { header: 'Documento', valor: d => d.documento },
    { header: 'Email', valor: d => d.email },
    { header: 'Teléfono', valor: d => d.telefono },
    { header: 'Departamento', valor: d => d.departamento },
    { header: 'Título académico', valor: d => d.tituloAcademico },
    { header: 'Fecha contratación', valor: d => d.fechaContratacion },
    { header: 'Salario', valor: d => String(d.salario) },
    { header: 'Estado', valor: d => (d.activo ? 'Activo' : 'Inactivo') }
  ];

  /** Exporta el listado de docentes a un archivo CSV. */
  exportarCsv(docentes: Docente[]): void {
    const encabezados = this.columnas.map(c => c.header);
    const filas = docentes.map(d => this.columnas.map(c => this.escaparCsv(c.valor(d))));
    const contenido = [encabezados, ...filas].map(fila => fila.join(',')).join('\r\n');

    // BOM para que Excel reconozca acentos en UTF-8.
    const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8;' });
    this.descargar(blob, `docentes-${this.fechaArchivo()}.csv`);
  }

  /** Exporta el listado de docentes a un archivo Excel (.xlsx). */
  exportarExcel(docentes: Docente[]): void {
    const datos = docentes.map(d => {
      const fila: Record<string, string | number> = {};
      this.columnas.forEach(c => {
        fila[c.header] = c.header === 'Salario' ? d.salario : c.valor(d);
      });
      return fila;
    });

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Docentes');
    XLSX.writeFile(libro, `docentes-${this.fechaArchivo()}.xlsx`);
  }

  /** Exporta el listado de docentes a un archivo PDF. */
  exportarPdf(docentes: Docente[]): void {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(16);
    doc.text('Listado de docentes', 14, 16);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [this.columnas.map(c => c.header)],
      body: docentes.map(d => this.columnas.map(c => c.valor(d))),
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`docentes-${this.fechaArchivo()}.pdf`);
  }

  private escaparCsv(valor: string): string {
    if (/[",\r\n]/.test(valor)) {
      return `"${valor.replace(/"/g, '""')}"`;
    }
    return valor;
  }

  private fechaArchivo(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private descargar(blob: Blob, nombre: string): void {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    URL.revokeObjectURL(url);
  }
}
