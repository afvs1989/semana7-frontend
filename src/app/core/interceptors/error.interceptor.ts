import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../state/auth.store';
import { CsrfService } from '../services/csrf.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const csrfService = inject(CsrfService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/status')) {
        csrfService.limpiarToken();
        authStore.setNoAutenticado();
        router.navigate(['/login'], {
          queryParams: { sesionExpirada: '1' }
        });
      }

      if (error.status === 403) {
        return throwError(() => ({
          ...error,
          error: { message: error.error?.message ?? 'No tiene permisos para realizar esta acción.' }
        }));
      }

      return throwError(() => error);
    })
  );
};
