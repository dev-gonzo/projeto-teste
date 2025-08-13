import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class RecuperarSenhaService {
    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    solicitarRecuperacaoSenha(cpf: string): Observable<any> {
        const body = {
            cpf: cpf
        }
        return this.http.post(`${this.baseUrl}/autenticacao/recuperar-senha`, body)
    }

    validarRecuperacaoSenha(token: string, senha: string): Observable<any> {
        const body = {
            codigo: token,
            senha: senha
        }
        return this.http.post(`${this.baseUrl}/autenticacao/recuperar-senha/validar`, body)
    }

}
