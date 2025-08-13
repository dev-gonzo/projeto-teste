import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ValidateTokenResponse } from "../../shared/models";

@Injectable({
    providedIn: 'root',
})

export class TokenService {
    private readonly API_URL = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }


    validateToken(body: { token: string; codigo: string }): Observable<ValidateTokenResponse> {
        return this.http.post<ValidateTokenResponse>(`${this.API_URL}/autenticacao/token/validar`, body);
    }

}