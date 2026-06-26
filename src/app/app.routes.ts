import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'inicio',
    loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent),
    canActivate: [authGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./features/usuarios/usuarios-list.component').then(m => m.UsuariosListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'usuarios/nuevo',
    loadComponent: () =>
      import('./features/usuarios/usuario-form.component').then(m => m.UsuarioFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'usuarios/:id/editar',
    loadComponent: () =>
      import('./features/usuarios/usuario-form.component').then(m => m.UsuarioFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'docentes',
    loadComponent: () =>
      import('./features/docentes/docentes-list.component').then(m => m.DocentesListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'docentes/nuevo',
    loadComponent: () =>
      import('./features/docentes/docente-form.component').then(m => m.DocenteFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'docentes/:id/editar',
    loadComponent: () =>
      import('./features/docentes/docente-form.component').then(m => m.DocenteFormComponent),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: 'inicio' }
];
