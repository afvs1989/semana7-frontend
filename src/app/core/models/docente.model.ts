export interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  email: string;
  telefono: string;
  departamento: string;
  tituloAcademico: string;
  fechaContratacion: string;
  salario: number;
  activo: boolean;
}

export const DEPARTAMENTOS = [
  'Ingeniería de Sistemas',
  'Matemáticas',
  'Física',
  'Química',
  'Economía',
  'Derecho',
  'Medicina',
  'Administración'
] as const;

export type Departamento = (typeof DEPARTAMENTOS)[number];

export interface DocenteFormData {
  nombres: string;
  apellidos: string;
  documento: string;
  email: string;
  telefono: string;
  departamento: string;
  tituloAcademico: string;
  fechaContratacion: string;
  salario: number;
  activo: boolean;
}
