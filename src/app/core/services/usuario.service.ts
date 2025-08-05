import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, filter, take } from 'rxjs/operators';

import {
  HistoricoAcoes,
  Page,
  PageImpl,
  PageResponse,
  ResponseSuccessHttp,
  Usuario,
} from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly endpoint = `${environment.apiUrl}/cadastros/usuarios`;
  private readonly urlUpload = `${environment.apiUrl}/cadastros/usuarios/upload-file`;
  private readonly urlLogs = `${environment.apiUrl}/cadastros/usuarios/logs`;

  constructor(private readonly http: HttpClient) {}

  private validateId(id: number | undefined): Observable<void> {
    if (id === undefined || id === null) {
      return throwError(() => new Error('ID é obrigatório'));
    }
    return of(void 0);
  }

  query(params: HttpParams): Observable<Page<Usuario>> {
    return this.http
      .get<PageResponse<Usuario>>(`${this.endpoint}`, { params })
      .pipe(
        map((response) => {
          const count = response.totalElements;
          const data: Usuario[] = response.content;
          return PageImpl.of(data, count);
        })
      );
  }

  getLogs(params: HttpParams, id: number | undefined): Observable<Page<HistoricoAcoes>> {
    return this.validateId(id).pipe(
      switchMap(() =>
        this.http
          .get<PageResponse<HistoricoAcoes>>(`${this.urlLogs}${id}`, { params })
          .pipe(
            map((response) => {
              const count = response.totalElements;
              const data: HistoricoAcoes[] = response.content;
              return PageImpl.of(data, count);
            })
          )
      )
    );
  }

  insert(model: Usuario): Observable<ResponseSuccessHttp> {
    return this.http.post<ResponseSuccessHttp>(`${this.endpoint}`, model);
  }

  update(model: Usuario, id: number | undefined): Observable<ResponseSuccessHttp> {
    return this.validateId(id).pipe(
      switchMap(() => this.http.put<ResponseSuccessHttp>(`${this.endpoint}${id}`, model))
    );
  }

  delete(id: number | undefined): Observable<ResponseSuccessHttp> {
    return this.validateId(id).pipe(
      switchMap(() => this.http.delete<ResponseSuccessHttp>(`${this.endpoint}${id}`))
    );
  }

  findById(id: number | undefined): Observable<Usuario> {
    return this.validateId(id).pipe(
      switchMap(() => this.http.get<Usuario>(`${this.endpoint}${id}`))
    );
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Usuario> {
    const idParam = route.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : undefined;

    if (!id) {
      return throwError(() => new Error('ID do usuário não fornecido na rota'));
    }

    return this.findById(id).pipe(
      filter((model: Usuario) => !!model),
      take(1)
    );
  }

  baixarModelo(): Observable<Blob> {
    return this.http
      .get(`${this.endpoint}arquivo-usuario`, {
        responseType: 'blob',
      })
      .pipe(
        map((data: Blob) => {
          return new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
        })
      );
  }

  finalizarUpload(): Observable<ResponseSuccessHttp> {
    return this.http.post<ResponseSuccessHttp>(`${this.endpoint}finalizar`, {});
  }
}
