import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { keys } from '../../shared/utils/variables';
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
  endpoint: string = `${environment.apiUrl}/cadastros/unidade-operacional/`;
  urlUpload: string = `${environment.apiUrl}/cadastros/unidade-operacional/upload-file`;
  urlLogs: string = `${environment.apiUrl}/cadastros/unidade-operacional/logs/`;
  private readonly token = localStorage.getItem(keys.TOKEN)


  constructor(private readonly http: HttpClient) { }

  query(params: HttpParams): Observable<Page<UnidadeOperacional>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http
      .get<Page<UnidadeOperacional>>(`${this.endpoint}`, {
        headers,
        params,
      })
      .pipe(
        map((response: any) => {
          const count = response.totalElements;
          const data: UnidadeOperacional[] = response.content;

          return PageImpl.of(data, count) as Page<UnidadeOperacional>;
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

  getAll(): Observable<UnidadeOperacional[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get<UnidadeOperacional[]>(`${this.endpoint}findall`, {
      headers,
    });
  }

  listByName(nome: string): Observable<UnidadeOperacional[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.get<UnidadeOperacional[]>(`${this.endpoint}nome/${nome}`, {
      headers,
    });
  }

  insert(model: UnidadeOperacional): Observable<ResponseSuccessHttp> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.post<ResponseSuccessHttp>(`${this.endpoint}`, model, {
      headers,
    });
  }

  update(model: UnidadeOperacional): Observable<ResponseSuccessHttp> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.put<ResponseSuccessHttp>(
      `${this.endpoint + model.id}`,
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

    if (!id) { 
      return throwError(() => new Error('ID is required')); 
    }
    
    return this.http.delete<ResponseSuccessHttp>(`${this.endpoint + id}`, {
      headers,
    });
  }

  findById(id: number): Observable<UnidadeOperacional> {
    return this.http.get<UnidadeOperacional>(`${this.endpoint + id}`);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UnidadeOperacional> {
    const id: any = route.paramMap.get('id');

    return this.findById(id).pipe(
      filter((model: UnidadeOperacional) => !!model),
      take(1)
    );
  }

  baixarModelo(): Observable<Blob> {
    return this.http.get(`${this.endpoint}arquivo-UnidadeOperacional`, { responseType: 'blob' }).pipe(
      map((data: Blob) => {
        return new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
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
