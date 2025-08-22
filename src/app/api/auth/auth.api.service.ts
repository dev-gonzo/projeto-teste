import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '@app/core/tokens/api-base-url.token';

import { AuthRequest, AuthResponse } from './auth.api.types';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  basePath  = '/auth/login';
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  login(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}${this.basePath}`, data);
  }
}
