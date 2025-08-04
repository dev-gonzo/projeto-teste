import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { keys } from '../../shared/utils/variables';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.getTokenFromCookie(keys.TOKEN);

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }

  private getTokenFromCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const match = document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith(`${name}=`));

    if (!match) {
      return null;
    }

    return decodeURIComponent(match.substring(name.length + 1));
  }
}
