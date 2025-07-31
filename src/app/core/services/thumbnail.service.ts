import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { keys } from '../../shared/utils';
import { Observable } from 'rxjs';
import { MidiasRelacionadasResponse } from '../../shared/models/midias.model';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  private baseUrl = environment.apiUrlMidia;
  private token = localStorage.getItem(keys.TOKEN);
  constructor(
    private http: HttpClient
  ) { }

  getThumbnail(idMidia: number, tipo: string): Observable<Blob> {
    const headers = {
      'Authorization': `Bearer ${this.token}`
    }
    return this.http.get(`${this.baseUrl}/midias/upload-oitiva/videos/${idMidia}/thumbnail?label=${encodeURIComponent(tipo)}`, { headers, responseType: 'blob' });
  }

  getMidiasRelacionadas(idOitiva: number, page: number = 0, size: number = 5): Observable<MidiasRelacionadasResponse>{
    const headers = {
      'Authorization': `Bearer ${this.token}`
    }
    return this.http.get<MidiasRelacionadasResponse>(`${this.baseUrl}/midias/upload-oitiva/videos/${idOitiva}/relacionados?page=${page}&size=${size}`, { headers });
  }
}
