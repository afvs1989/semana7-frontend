import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.autenticado()) {
    return router.createUrlTree(['/login']);
  }

  if (authStore.esAdministrador()) {
    return true;
  }

  return router.createUrlTree(['/inicio']);
};
