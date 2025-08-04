import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { Observable, of, tap } from 'rxjs';

import {
  LOGGED_ERROR_RESPONSE,
  LOGGED_SUCCESS_RESPONSE,
} from '../../shared/utils/mock-data';
import { keys } from '../../shared/utils/variables';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  constructor(
    private httpClient: HttpClient, 
    private router: Router,
    private crypto: CryptoService
  ) {}

  login(credentials: {cpf: string, senha: string}): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/cadastros/auth/login`, credentials).pipe(tap((response: any) => {
        if (response && response.token) {
            localStorage.setItem(keys.TOKEN, response.token);
            this.router.navigate(['/auth/validate-token']);
            this.emitLoggedInEvent();
        }
    }))

  }

  logout(): Observable<any> {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if(token){
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.httpClient.delete(`${this.API_URL}/cadastros/auth/logout`, {
      headers, responseType: 'text' as const
    }).pipe(
      tap(() => {
        localStorage.removeItem(keys.TOKEN);
      })
    )

  }

  loggedInEvent: EventEmitter<any> = new EventEmitter();
  emitLoggedInEvent() {
    this.loggedInEvent.emit();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(keys.TOKEN);
    }
    return null;
  }
  getAppToken(): string | null {
    const encryptedKey = this.crypto.hashKey(keys.COOKIE_TOKEN) + '=';
    if(typeof window !== 'undefined' && typeof document !== 'undefined') {

      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(';');
  
      for(let c of cookies){
        c = c.trim();
        if(c.startsWith(encryptedKey)){
          const encrypted = c.substring(encryptedKey.length);
          return this.crypto.decrypt(encrypted);
        }
      }
    }
    return null
  }

  setAppToken(token: string): string | null {
    const encryptedToken = this.crypto.encrypt(token);
    const encryptedKey = this.crypto.hashKey(keys.COOKIE_TOKEN);
    if(typeof window !== 'undefined' && typeof document !== 'undefined') {
      const now = new Date();
      const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      document.cookie = `${encryptedKey}=${encryptedToken}; expires=${expires.toUTCString()}; path=/`;
    }
    return null
  }

  removeAppToken(): void {
    const encryptedKey = this.crypto.hashKey(keys.COOKIE_TOKEN);
    document.cookie = `${encryptedKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  isAuthenticatedUser(): boolean {
    return !!this.getToken();
  }
  isAuthenticatedToken(): boolean {
    return !!this.getAppToken();
  }
}
