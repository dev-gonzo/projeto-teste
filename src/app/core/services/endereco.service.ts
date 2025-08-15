import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Uf, Endereco, Municipio } from '../../shared/models';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService extends ApiService {
  private readonly endpoint = `${environment.apiUrl}/endereco`;

  constructor(protected override authService: AuthService, private readonly http: HttpClient) {
    super(authService);
  }

  getUFs(): Observable<Uf[]> {
    return this.http.get<Uf[]>(`${this.endpoint}/ufs`, { headers: this.getAuthHeaders() });
  }

  getMunicipiosPorNome(nome: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.endpoint}/municipio/${nome}`, { headers: this.getAuthHeaders() });
  }

  getEnderecoPorCEP(cep: string | number): Observable<Endereco> {
    return this.http.get<any>(`${this.endpoint}/cep/${cep}`, { headers: this.getAuthHeaders() }).pipe(
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
          uf: apiData.uf
        }
      } as Endereco))
    );
  }
}
