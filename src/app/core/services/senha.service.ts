import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SenhaService {
    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    criarSenha(idUsuario: number, senha: string, token: string): Observable<any> {
        const endpoint = this.baseUrl + '/cadastros/auth/create-senha';
        const body = {
            idUsuario: idUsuario,
            senha: senha,
            token: token
        };
        return this.http.post(endpoint, body, { responseType: 'text' });
    }
}