import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { keys } from '../../shared/utils/variables';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly cookieService: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get(keys.TOKEN);

    const publicPatterns: RegExp[] = [
      /\/unidade-operacional\/list-all/,    
      /\/auth\/.*$/,                        
      /\/autenticacao\/.*/                  
    ];

    const isPublic = publicPatterns.some(pattern => pattern.test(req.url));

    if (isPublic) {
      return next.handle(req);
    }

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
}
