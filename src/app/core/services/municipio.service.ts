import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Municipio } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MunicipioApiService {
  endpoint: string = `${environment.apiUrl}/cadastros/municipios`;
  constructor(private http: HttpClient) {}

  query(nome: string): Observable<Municipio[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.get<Municipio[]>(`${this.endpoint}/${nome}`, {
      headers,
    });
  }
}
