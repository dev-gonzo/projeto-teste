import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../../shared/models';
import { keys } from '../../shared/utils/variables';



@Injectable({
  providedIn: 'root',
})
export class DadosUsuarioService {
    constructor( private http: HttpClient){}
    private baseUrl = environment.apiUrl;
    private token = localStorage.getItem(keys.TOKEN)

    getDadosUsuario(): Observable<any>{

        return this.http.get(`${this.baseUrl}/cadastros/auth/account`)

    }
}