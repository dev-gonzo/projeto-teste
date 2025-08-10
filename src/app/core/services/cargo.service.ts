import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Cargo } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class CargoService {
  endpoint: string = `${environment.apiUrl}/cargos`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.endpoint);
  }
}