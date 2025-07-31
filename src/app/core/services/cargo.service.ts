import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Cargo } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CargoApiService {
  endpoint: string = `${environment.apiUrl}/cadastros/cargos`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Cargo[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.get<Cargo[]>(`${this.endpoint}`, {
      headers,
    });
  }
}
