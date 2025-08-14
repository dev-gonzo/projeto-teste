import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(protected authService: AuthService) {}

  protected getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? this.jsonHeaders.set('Authorization', `Bearer ${token}`) : this.jsonHeaders;
  }
}
