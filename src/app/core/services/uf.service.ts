import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Uf } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UfService {
  endpoint: string = `${environment.apiUrl}/cadastros/ufs`;
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Uf[]> {
    return this.http.get<Uf[]>(`${this.endpoint}`);
  }
}
