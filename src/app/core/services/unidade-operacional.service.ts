import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, filter, take, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { keys } from '../../shared/utils/variables';
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
  Endereco,
} from '../../shared/models';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnidadeOperacionalService {
  private readonly endpoint = `${environment.apiUrl}/unidade-operacional`;
  public readonly urlUpload = `${environment.apiUrl}/unidades/upload-file`;
  private readonly urlLogs = `${environment.apiUrl}/unidades/logs`;

  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService,
    private readonly authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? this.jsonHeaders.set('Authorization', `Bearer ${token}`) : this.jsonHeaders;
  }

  query(params: HttpParams): Observable<Page<UnidadeOperacional>> {
    const token = this.authService.getToken();
    const headers = token
      ? this.jsonHeaders.set('Authorization', `Bearer ${token}`)
      : this.jsonHeaders;

    return this.http.get<any>(this.endpoint, { params, headers }).pipe(
      map(response => {
        const content: UnidadeOperacional[] = (response._embedded?.unidadeOperacionalDTOList || []).map(
          (unidadeDTO: any) => ({
            id: unidadeDTO.id,
            nomeUnidadeOperacional: unidadeDTO.nomeUnidadeOperacional,
            responsavelUnidadeOperacional: unidadeDTO.responsavelUnidadeOperacional,
            status: unidadeDTO.status,
            numeroTelefonePrincipal: unidadeDTO.numeroTelefonePrincipal,
            numeroTelefoneSecundario: unidadeDTO.numeroTelefoneSecundario,
            telefoneCompleto: [unidadeDTO.numeroTelefonePrincipal, unidadeDTO.numeroTelefoneSecundario]
              .filter(Boolean)
              .join(' / '),

            endereco: {
              municipioNome: unidadeDTO.endereco?.municipioNome,
              bairro: unidadeDTO.endereco?.bairro,
              logradouro: unidadeDTO.endereco?.logradouro,
              numero: unidadeDTO.endereco?.numero,
              cep: unidadeDTO.endereco?.cep,
              estadoSigla: unidadeDTO.endereco?.estadoSigla,
            } as Endereco
          })
        );

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
