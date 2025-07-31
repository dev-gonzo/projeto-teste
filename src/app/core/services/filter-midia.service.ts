import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterMidiaService {
  private urlApi: string = environment.apiUrlMidia;

  constructor(
    private http: HttpClient
  ) { }

  filterMidia(filtros: any): Observable<any>{
    let params = new HttpParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if(value !== null && value !== undefined && value !== ''){
        if(key === 'responsavel'){
          key = 'nomeResponsavel';
        }
        else if(key === 'dataUpload'){
          key = 'dataUpload';
        }
        else if(key === 'nomeDelegaciaInquerito'){
          key = 'nomeDelegaciaInquerito';
        }
        else if(key === 'status'){
          key = 'statusTranscricaoId'
        }


        if(typeof value === 'object'){
          if(value && typeof value === 'object' && 'id' in value){
            value = value.id
          }
          else if('opcao' in value){
            value = value.opcao
          }
          else if(value instanceof Date){
            value = value.toISOString().split('T')[0]
          }
        }
        params = params.set(key, String(value));
      }
    })

    return this.http.get(`${this.urlApi}/midias/?`, {params})
  }

  findAllMidia(): Observable<any>{
    return this.http.get(`${this.urlApi}/midias/findall`)
  }
}
