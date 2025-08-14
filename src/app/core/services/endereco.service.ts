import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Uf, Endereco, Municipio } from '../../shared/models';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  private readonly endpoint = `${environment.apiUrl}/endereco`;
  private readonly jsonHeaders: HttpHeaders;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {
    this.jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? this.jsonHeaders.set('Authorization', `Bearer ${token}`) : this.jsonHeaders;
  }

  getUFs(): Observable<Uf[]> {
    return this.http.get<Uf[]>(`${this.endpoint}/ufs`, { headers: this.getAuthHeaders() });
  }

  getMunicipiosPorNome(nome: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.endpoint}/municipio/${nome}`, { headers: this.getAuthHeaders() });
  }

  getEnderecoPorCEP(cep: string | number): Observable<Endereco> {
    return this.http.get<any>(`${this.endpoint}/cep/${cep}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(apiData => ({
          id: 0,
          cep: apiData.cep,
          logradouro: apiData.logradouro,
          bairro: apiData.bairro,
          complemento: apiData.complemento,
          municipio: {
            id: 0,
            codigoIbge: Number(apiData.ibge),
            nome: apiData.localidade,
            uf: {
              id: 0,
              codigoIbge: Number(apiData.ibge.slice(0, 2)),
              nome: apiData.estado || '',
              sigla: apiData.uf
            }
          }
        } as Endereco))
      );
  }
}