import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest,
  HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { keys } from '../../shared/utils/variables';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has('No-Auth')) {
      const clonedRequest = req.clone({
        headers: req.headers.delete('No-Auth')
      });
      return next.handle(clonedRequest);
    }
    const token = localStorage.getItem(keys.TOKEN);
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          localStorage.removeItem(keys.TOKEN);
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
