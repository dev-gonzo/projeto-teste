import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

export const AuthGuard: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const token = localStorage.getItem('auth-token');

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);
    const now = Math.floor(Date.now() / 1000); 

    if (payload.exp && payload.exp < now) {
      localStorage.removeItem('auth-token');
      router.navigate(['/auth/login']);
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem('auth-token');
    router.navigate(['/auth/login']);
    return false;
  }
};
