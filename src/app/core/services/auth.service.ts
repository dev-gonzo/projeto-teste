import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map, of, catchError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../../environments/environment';
import { keys } from '../../shared/utils/variables';
import { CryptoService } from './crypto.service';
import { LoginResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  public loggedInEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly crypto: CryptoService,
    private readonly cookieService: CookieService
  ) { }

  public login(credentials: { cpf: string; senha: string }): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.API_URL}/cadastros/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response?.token) {
            this.setAppToken(response.token);
            this.router.navigate(['/auth/validate-token']);
            this.emitLoggedInEvent();
          }
        })
      );
  }

  public logout(): Observable<{ success: boolean; message: string | null }> {
    const token = this.getAppToken();

    if (!token) {
      this.router.navigate(['/auth/login']);
      return of({ success: true, message: null });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient
      .delete<any>(`${this.API_URL}/cadastros/auth/logout`, { headers })
      .pipe(
        tap(() => {
          this.removeAppToken();
          this.router.navigate(['/auth/login']);
          this.emitLoggedInEvent();
        }),
        map(response => {
          if (response === null) {
            return { success: true, message: null };
          }
          return {
            success: !!response.success,
            message: response.message || (response.success ? null : 'Falha no logout'),
          };
        }),
        catchError(error => {
          const message =
            error?.error?.message ||
            error?.message ||
            'Erro desconhecido ao fazer logout';
          return of({ success: false, message });
        })
      );
  }

  private emitLoggedInEvent(): void {
    this.loggedInEvent.emit();
  }

  public getToken(): string | null {
    return this.getAppToken();
  }

  public isAuthenticatedUser(): boolean {
    return this.isAuthenticatedToken();
  }

  public setAppToken(token: string): void {
    const encryptedToken = this.crypto.encrypt(token);
    const encryptedKey = this.crypto.hashKey(keys.COOKIE_TOKEN);

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    this.cookieService.set(encryptedKey, encryptedToken, { expires, path: '/' });
  }

  public getAppToken(): string | null {
    const encryptedKey = this.crypto.hashKey(keys.COOKIE_TOKEN);

    if (!this.cookieService.check(encryptedKey)) {
      return null;
    }

    const encryptedToken = this.cookieService.get(encryptedKey);
    return this.crypto.decrypt(encryptedToken);
  }

  public removeAppToken(): void {
    const encryptedKey = this.crypto.hashKey(keys.COOKIE_TOKEN);
    this.cookieService.delete(encryptedKey, '/');
  }

  public isAuthenticatedToken(): boolean {
    const encryptedKey = this.crypto.hashKey(keys.COOKIE_TOKEN);
    return this.cookieService.check(encryptedKey);
  }
}