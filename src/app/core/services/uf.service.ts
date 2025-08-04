import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Uf } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UfApiService {
  endpoint: string = `${environment.apiUrl}/cadastros/ufs`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Uf[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.get<Uf[]>(`${this.endpoint}`, {
      headers,
    });
  }
}
