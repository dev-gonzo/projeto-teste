import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Perfil } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerfilApiService {
  endpoint: string = `${environment.apiUrl}/cadastros/perfis`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Perfil[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.get<Perfil[]>(`${this.endpoint}`, {
      headers,
    });
  }
}
