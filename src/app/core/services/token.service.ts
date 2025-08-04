import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})

export class TokenService {

    private readonly API_URL = environment.apiUrl;

    private jwtToken: string | null = null;

    constructor(private http: HttpClient) {}

    requestToken(body: { email: string }): Promise<any> {
        return this.http.post(`${this.API_URL}/cadastros/auth/request-token`, body).toPromise()
    }

    setToken(jwt: string){
        this.jwtToken = jwt;
    }; 

    getToken(): string{
        return this.jwtToken || '';
    }

    clearToken(){
        this.jwtToken = null;
    }

    validateToken(body: {token: string, jwt: string}): Promise<any>{
        return this.http.post(`${this.API_URL}/cadastros/auth/validate-token`, body, {responseType: 'text'}).toPromise()
    }

}