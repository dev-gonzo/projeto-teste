import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { keys } from '../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class VideoOitivaService {

  private baseUrl = environment.apiUrlMidia
  private token = localStorage.getItem(keys.TOKEN);

  constructor(
    private http: HttpClient,
  ) { }

  getVideoOitiva(id: number): Observable<Blob>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    })

    return this.http.get(`${this.baseUrl}/midias/upload-oitiva/videos/${id}/video`, { headers, responseType: 'blob' });
  }
}
