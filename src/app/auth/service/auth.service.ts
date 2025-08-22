
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ToastService } from '@app/shared/components/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth-token';

  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

   logout(): void {
    this.clear();
    this.router.navigate(['/auth/login']);
    this.toast.success('Logout realizado com sucesso!');
  }
}
