import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  canActivate(): boolean {
    return this.checkLoggedIn();
  }

  private checkLoggedIn(): boolean {
    if (!this.authService.isAuthenticatedUser()) {
      this.router.navigate(['auth/login']);
      return false;
    }
    return true;
  }

}
