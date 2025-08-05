import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Municipio } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MunicipioService {
  endpoint: string = `${environment.apiUrl}/cadastros/municipios`;
  constructor(private readonly http: HttpClient) {}

  query(nome: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.endpoint}/${nome}`);
  }
}
