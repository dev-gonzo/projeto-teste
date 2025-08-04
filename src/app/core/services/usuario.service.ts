import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { keys } from '../../shared/utils/variables';
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
  endpoint: string = `${environment.apiUrl}/cadastros/usuarios/`;
  urlUpload: string = `${environment.apiUrl}/cadastros/usuarios/upload-file`;
  urlLogs: string = `${environment.apiUrl}/cadastros/usuarios/logs/`;
  private token = localStorage.getItem(keys.TOKEN)
  constructor(private http: HttpClient) {}

  query(params: HttpParams): Observable<Page<Usuario>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http
      .get<Page<Usuario>>(`${this.endpoint}`, {
        headers,
        params,
      })
      .pipe(
        map((response: any) => {
          const count = response.totalElements;
          const data: Usuario[] = response.content;

          return PageImpl.of(data, count) as Page<Usuario>;
        })
      );
  }

  getLogs(params: HttpParams, id: number): Observable<Page<HistoricoAcoes>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${this.token}`,
    }); 
    return this.http
      .get<Page<HistoricoAcoes>>(`${this.urlLogs}${id}`, {
        headers,
        params,
      })
      .pipe(
        map((response: any) => {
          const count = response.totalElements;
          const data: HistoricoAcoes[] = response.content;
          return PageImpl.of(data, count) as Page<HistoricoAcoes>;
        })
      );
  }

  insert(model: Usuario): Observable<ResponseSuccessHttp> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.post<ResponseSuccessHttp>(`${this.endpoint}`, model, {
      headers,
    });
  }

  update(model: Usuario, id: number): Observable<ResponseSuccessHttp> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.put<ResponseSuccessHttp>(
      `${this.endpoint}${id}`,
      model,
      {
        headers,
      }
    );
  }

  delete(id: number | undefined): Observable<ResponseSuccessHttp> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.delete<ResponseSuccessHttp>(`${this.endpoint + id}`, {
      headers,
    });
  }

  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.endpoint + id}`);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Usuario> {
    const id: any = route.paramMap.get('id');

    return this.findById(id).pipe(
      filter((model: Usuario) => !!model),
      take(1)
    );
  }

  baixarModelo(): Observable<Blob> {
    const params: any = { responseType: 'arraybuffer' };

    return this.http.get(`${this.endpoint}arquivo-usuario`, params).pipe(
      map((data: ArrayBuffer) => {
        return new Blob([data], { type: 'xlsx' });
      })
    );
  }

  finalizarUpload(): Observable<ResponseSuccessHttp> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.post<ResponseSuccessHttp>(
      `${this.endpoint}finalizar`,
      {},
      {
        headers,
      }
    );
  }
}
