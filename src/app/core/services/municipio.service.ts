import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Municipio } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MunicipioService {
  endpoint: string = `${environment.apiUrl}/endereco`;
  constructor(private readonly http: HttpClient) { }

  query(nome: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.endpoint}/municipio/${nome}`);
  }

  queryCEP(cep: number): Observable<any> {
    return this.http.get<Municipio[]>(`${this.endpoint}/cep/${cep}`);
  }
}
