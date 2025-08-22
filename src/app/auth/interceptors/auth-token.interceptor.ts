import {
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const token = localStorage.getItem('auth-token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
