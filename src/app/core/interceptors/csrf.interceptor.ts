import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { CsrfService } from '../services/csrf.service';

const METODOS_MUTANTES = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (!METODOS_MUTANTES.has(req.method) || req.url.includes('/auth/login')) {
    return next(req);
  }

  const csrfService = inject(CsrfService);

  return from(csrfService.obtenerToken()).pipe(
    switchMap(token =>
      next(
        req.clone({
          setHeaders: { 'X-XSRF-TOKEN': token }
        })
      )
    )
  );
};
