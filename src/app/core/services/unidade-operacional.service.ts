import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, filter, take, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  UnidadeOperacional,
  HistoricoAcoes,
  Page,
  PageImpl,
  ResponseSuccessHttp,
} from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnidadeOperacionalApiService {
  private readonly endpoint = `${environment.apiUrl}/cadastros/unidade-operacional/`;
  private readonly urlUpload = `${environment.apiUrl}/cadastros/unidade-operacional/upload-file`;
  private readonly urlLogs = `${environment.apiUrl}/cadastros/unidade-operacional/logs/`;

  constructor(private readonly http: HttpClient) {}

  private get jsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });
  }

  query(params: HttpParams): Observable<Page<UnidadeOperacional>> {
    return this.http.get<Page<UnidadeOperacional>>(this.endpoint, { params }).pipe(
      map((response: any) => {
        const count = response.totalElements;
        const data: UnidadeOperacional[] = response.content;
        return PageImpl.of(data, count);
      })
    );
  }

  getLogs(params: HttpParams, id: number): Observable<Page<HistoricoAcoes>> {
    return this.http.get<Page<HistoricoAcoes>>(`${this.urlLogs}${id}`, { params }).pipe(
      map((response: any) => {
        const count = response.totalElements;
        const data: HistoricoAcoes[] = response.content;
        return PageImpl.of(data, count);
      })
    );
  }

  getAll(): Observable<UnidadeOperacional[]> {
    return this.http.get<UnidadeOperacional[]>(`${this.endpoint}findall`);
  }

  listByName(nome: string): Observable<UnidadeOperacional[]> {
    return this.http.get<UnidadeOperacional[]>(`${this.endpoint}nome/${nome}`, {
      headers: this.jsonHeaders,
    });
  }

  insert(model: UnidadeOperacional): Observable<ResponseSuccessHttp> {
    return this.http.post<ResponseSuccessHttp>(this.endpoint, model, {
      headers: this.jsonHeaders,
    });
  }

  update(model: UnidadeOperacional): Observable<ResponseSuccessHttp> {
    return this.http.put<ResponseSuccessHttp>(`${this.endpoint}${model.id}`, model, {
      headers: this.jsonHeaders,
    });
  }

  delete(id: number | undefined): Observable<ResponseSuccessHttp> {
    if (!id) {
      return throwError(() => new Error('ID is required'));
    }

    return this.http.delete<ResponseSuccessHttp>(`${this.endpoint}${id}`, {
      headers: this.jsonHeaders,
    });
  }

  findById(id: number): Observable<UnidadeOperacional> {
    return this.http.get<UnidadeOperacional>(`${this.endpoint}${id}`);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UnidadeOperacional> {
    const id = route.paramMap.get('id');
    return this.findById(Number(id)).pipe(
      filter((model: UnidadeOperacional) => !!model),
      take(1)
    );
  }

  baixarModelo(): Observable<Blob> {
    return this.http
      .get(`${this.endpoint}arquivo-UnidadeOperacional`, { responseType: 'blob' })
      .pipe(
        map((data: Blob) => new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }))
      );
  }

  finalizarUpload(): Observable<ResponseSuccessHttp> {
    return this.http.post<ResponseSuccessHttp>(
      `${this.endpoint}finalizar`,
      {},
      {
        headers: this.jsonHeaders,
      }
    );
  }
}