import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, filter, take } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  HistoricoAcoes,
  Page,
  PageImpl,
  ResponseSuccessHttp,
  Usuario,
} from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioApiService {
  private readonly endpoint = `${environment.apiUrl}/cadastros/usuarios/`;
  private readonly urlUpload = `${environment.apiUrl}/cadastros/usuarios/upload-file`;
  private readonly urlLogs = `${environment.apiUrl}/cadastros/usuarios/logs/`;

  constructor(private readonly http: HttpClient) {}

  query(params: HttpParams): Observable<Page<Usuario>> {
    return this.http
      .get<Page<Usuario>>(`${this.endpoint}`, { params })
      .pipe(
        map((response: any) => {
          const count = response.totalElements;
          const data: Usuario[] = response.content;
          return PageImpl.of(data, count) as Page<Usuario>;
        })
      );
  }

  getLogs(params: HttpParams, id: number): Observable<Page<HistoricoAcoes>> {
    return this.http
      .get<Page<HistoricoAcoes>>(`${this.urlLogs}${id}`, { params })
      .pipe(
        map((response: any) => {
          const count = response.totalElements;
          const data: HistoricoAcoes[] = response.content;
          return PageImpl.of(data, count) as Page<HistoricoAcoes>;
        })
      );
  }

  insert(model: Usuario): Observable<ResponseSuccessHttp> {
    return this.http.post<ResponseSuccessHttp>(`${this.endpoint}`, model);
  }

  update(model: Usuario, id: number): Observable<ResponseSuccessHttp> {
    return this.http.put<ResponseSuccessHttp>(`${this.endpoint}${id}`, model);
  }

  delete(id: number | undefined): Observable<ResponseSuccessHttp> {
    return this.http.delete<ResponseSuccessHttp>(`${this.endpoint}${id}`);
  }

  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.endpoint}${id}`);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Usuario> {
    const id: any = route.paramMap.get('id');
    const numeroId = parseInt(id);

    return this.findById(numeroId).pipe(
      filter((model: Usuario) => !!model),
      take(1)
    );
  }

  baixarModelo(): Observable<Blob> {
    return this.http
      .get(`${this.endpoint}arquivo-usuario`, {
        responseType: 'arraybuffer',
      })
      .pipe(
        map((data: ArrayBuffer) => {
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
