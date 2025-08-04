import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class EmailService{
    private baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    enviarEmail(email: string): Observable<any>{
        const body = {
            destinatario: email,
            moduloAdm: true
        }
        return this.http.post(`${this.baseUrl}/cadastros/emails/envioEmail`, body, { responseType: 'text' })
    }

    validarEmail(token: string): Observable<any>{
        return this.http.get(`${this.baseUrl}/cadastros/emails/verificarEmail/${token}`)
    }
}
