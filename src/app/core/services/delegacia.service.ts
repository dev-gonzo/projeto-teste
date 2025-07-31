import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { keys } from '../../shared/utils/variables';
import { Observable, filter, take } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Delegacia,
  HistoricoAcoes,
  Page,
  PageImpl,
  ResponseSuccessHttp,
} from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DelegaciaApiService {
  endpoint: string = `${environment.apiUrl}/cadastros/delegacias/`;
  urlUpload: string = `${environment.apiUrl}/cadastros/delegacias/upload-file`;
  urlLogs: string = `${environment.apiUrl}/cadastros/delegacias/logs/`;
  private token = localStorage.getItem(keys.TOKEN)


  constructor(private http: HttpClient) {}

  query(params: HttpParams): Observable<Page<Delegacia>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http
      .get<Page<Delegacia>>(`${this.endpoint}`, {
        headers,
        params,
      })
      .pipe(
        map((response: any) => {
          const count = response.totalElements;
          const data: Delegacia[] = response.content;

          return PageImpl.of(data, count) as Page<Delegacia>;
        })
      );
  }

  getLogs(params: HttpParams): Observable<Page<HistoricoAcoes>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http
      .get<Page<HistoricoAcoes>>(`${this.urlLogs}`, {
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

  getAll(): Observable<Delegacia[]> {

    return this.http.get<Delegacia[]>(`${this.endpoint}findall`);
  }


  listByName(nome: string): Observable<Delegacia[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.get<Delegacia[]>(`${this.endpoint}nome/${nome}`, {
      headers,
    });
  }

  insert(model: Delegacia): Observable<ResponseSuccessHttp> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });

    return this.http.post<ResponseSuccessHttp>(`${this.endpoint}`, model, {
      headers,
    });
  }

  update(model: Delegacia): Observable<ResponseSuccessHttp> {
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

    return this.http.delete<ResponseSuccessHttp>(`${this.endpoint + id}`, {
      headers,
    });
  }

  findById(id: number): Observable<Delegacia> {
    return this.http.get<Delegacia>(`${this.endpoint + id}`);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Delegacia> {
    const id: any = route.paramMap.get('id');

    return this.findById(id).pipe(
      filter((model: Delegacia) => !!model),
      take(1)
    );
  }

  baixarModelo(): Observable<Blob> {
    const params: any = { responseType: 'arraybuffer' };

    return this.http.get(`${this.endpoint}arquivo-delegacia`, params).pipe(
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
