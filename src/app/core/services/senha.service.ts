import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class SenhaService{
    private baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    criarSenha(idUsuario: number, senha: string): Observable<any>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json' 
        });
        const body = {
            idUsuario: idUsuario,
            senha: senha
        }
        return this.http.post(`${this.baseUrl}/cadastros/auth/create-senha`, body, { responseType: 'text' })
    }
}