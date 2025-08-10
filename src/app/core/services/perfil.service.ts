import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Perfil } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
    endpoint: string = `${environment.apiUrl}/perfis`;

    constructor(private readonly http: HttpClient) { }

    getAll(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(this.endpoint);
    }
}