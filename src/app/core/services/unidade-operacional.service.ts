import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, filter, take, throwError, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {
  UnidadeOperacional,
  HistoricoAcoes,
  Page,
  PageImpl,
  ResponseSuccessHttp,
  PageResponse,
  ListaUnidadeOperacional,
  UnidadeOperacionalPageResponse,
  Municipio,
  Endereco
} from '../../shared/models';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnidadeOperacionalService extends ApiService {
  private readonly endpoint = `${environment.apiUrl}/unidade-operacional`;
  public readonly urlUpload = `${environment.apiUrl}/unidades/upload-file`;
  private readonly urlLogs = `${environment.apiUrl}/unidades/logs`;

  constructor(
    protected override authService: AuthService,
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) {
    super(authService);
  }

  query(params: HttpParams): Observable<Page<UnidadeOperacional>> {
    return this.http
      .get<UnidadeOperacionalPageResponse>(this.endpoint, { params, headers: this.getAuthHeaders() })
      .pipe(
        map(response => {
          const content: UnidadeOperacional[] =
            (response._embedded?.unidadeOperacionalDTOList || []).map(unidadeOperacionalDTO => ({
              id: unidadeOperacionalDTO.id,
              nomeUnidadeOperacional: unidadeOperacionalDTO.nomeUnidadeOperacional,
              responsavelUnidadeOperacional: unidadeOperacionalDTO.responsavelUnidadeOperacional,
              status: unidadeOperacionalDTO.status,
              numeroTelefonePrincipal: unidadeOperacionalDTO.numeroTelefonePrincipal,
              numeroTelefoneSecundario: unidadeOperacionalDTO.numeroTelefoneSecundario,
              telefoneCompleto: [
                unidadeOperacionalDTO.numeroTelefonePrincipal,
                unidadeOperacionalDTO.numeroTelefoneSecundario
              ].filter(Boolean).join(' / '),
              endereco: {
                municipioNome: unidadeOperacionalDTO.endereco?.municipioNome,
                bairro: unidadeOperacionalDTO.endereco?.bairro,
                logradouro: unidadeOperacionalDTO.endereco?.logradouro,
                numero: unidadeOperacionalDTO.endereco?.numero,
                cep: unidadeOperacionalDTO.endereco?.cep,
                estadoSigla: unidadeOperacionalDTO.endereco?.estadoSigla,
              } as Endereco
            }));

          const totalElements = response.page?.totalElements || content.length;
          return PageImpl.of(content, totalElements);
        })
      );
  }


  getLogs(params: HttpParams, id: number): Observable<Page<HistoricoAcoes>> {
    return this.http
      .get<PageResponse<HistoricoAcoes>>(`${this.urlLogs}/${id}`, { params, headers: this.getAuthHeaders() })
      .pipe(map(response => PageImpl.of(response.content, response.totalElements)));
  }

  getAll(): Observable<UnidadeOperacional[]> {
    return this.http.get<UnidadeOperacional[]>(`${this.endpoint}/findall`, { headers: this.getAuthHeaders() });
  }

  listaTodasUnidadesOperacionais(): Observable<ListaUnidadeOperacional[]> {
    return this.http.get<ListaUnidadeOperacional[]>(`${this.endpoint}/list-all`);
  }

  listByName(nome: string): Observable<UnidadeOperacional[]> {
    return this.http.get<UnidadeOperacional[]>(`${this.endpoint}/nome/${nome}`, { headers: this.getAuthHeaders() });
  }

  insert(model: UnidadeOperacional): Observable<ResponseSuccessHttp> {
    return this.http.post<ResponseSuccessHttp>(this.endpoint, model, { headers: this.getAuthHeaders() });
  }

  update(model: UnidadeOperacional): Observable<ResponseSuccessHttp> {
    return this.http.put<ResponseSuccessHttp>(`${this.endpoint}/${model.id}`, model, { headers: this.getAuthHeaders() });
  }

  delete(id: number | undefined): Observable<ResponseSuccessHttp> {
    if (!id) return throwError(() => new Error('ID is required'));
    return this.http.delete<ResponseSuccessHttp>(`${this.endpoint}/${id}`, { headers: this.getAuthHeaders() });
  }

  findById(id: number): Observable<UnidadeOperacional> {
    return this.http.get<UnidadeOperacional>(`${this.endpoint}/${id}`, { headers: this.getAuthHeaders() });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UnidadeOperacional> {
    const id = route.paramMap.get('id');
    if (!id) return throwError(() => new Error('ID não encontrado na rota'));
    return this.findById(Number(id)).pipe(filter(model => !!model), take(1));
  }

  baixarModelo(): Observable<Blob> {
    return this.http
      .get(`${this.endpoint}/arquivo-UnidadeOperacional`, { responseType: 'blob', headers: this.getAuthHeaders() })
      .pipe(map(data => new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })));
  }

  finalizarUpload(): Observable<ResponseSuccessHttp> {
    return this.http.post<ResponseSuccessHttp>(`${this.endpoint}/finalizar`, {}, { headers: this.getAuthHeaders() });
  }
}
