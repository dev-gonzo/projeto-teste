import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class RecuperarSenharService {
    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    solicitarRecuperacaoSenha(cpf: string): Observable<any> {
        sessionStorage.setItem('cpfRecuperacao', cpf);
        const body = {
            cpf: cpf,
            urlRedirect: "http://192.168.208.64:4201/avs-portaldemidias/auth/criar-senha"
        }
        return this.http.post(`${this.baseUrl}/autenticacao/recuperar-senha`, body)
    }

    validarRecuperacaoSenha(cpf: string, codigo: string, senha: string): Observable<any> {
        const body = {
            cpf: cpf,
            senha: senha,
            codigo: codigo
        }
        return this.http.post(`${this.baseUrl}/autenticacao/recuperar-senha/validar`, body)
    }

}
