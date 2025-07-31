import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    return this.checkLoggedIn();
  }

  private checkLoggedIn(): boolean {
    // if (this.authService.isAuthenticatedUser()) {
    //   if (this.authService.isAuthenticatedToken()) {
    //     return true;
    //   }
    //   this.router.navigate(['auth/validate-token']);
    //   return false;
    // } else {
    //   this.router.navigate(['auth/login']);
    //   return false;
    // }

    return true
  }
}
