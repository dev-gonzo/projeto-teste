import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class TokenService {

    private readonly API_URL = environment.apiUrl;

    private jwtToken: string | null = null;

    constructor(private readonly http: HttpClient) { }

    requestToken(body: { email: string }): Observable<any> {
        return this.http.post(`${this.API_URL}/cadastros/auth/request-token`, body);
    }

    setToken(jwt: string) {
        this.jwtToken = jwt;
    };

    getToken(): string {
        return this.jwtToken || '';
    }

    clearToken() {
        this.jwtToken = null;
    }

    validateToken(body: { jwt: string; token: string }): Observable<{ sessionToken: string }> {
        return this.http.post<{ sessionToken: string }>(`${this.API_URL}/cadastros/auth/validate-token`, body);
    }
}