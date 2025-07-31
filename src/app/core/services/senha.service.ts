import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class SenhaService{
    private baseUrl = environment.apiUrlMidia;
    constructor(private http: HttpClient){}

    criarSenha(idUsuario: number, senha: string, email: string): Observable<any>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json' 
        });
        const body = {
            idUsuario: idUsuario,
            senha: senha,
            email: email
        }
        return this.http.post(`${this.baseUrl}/midias/auth/create-senha`, body, { responseType: 'text' })
    }
}