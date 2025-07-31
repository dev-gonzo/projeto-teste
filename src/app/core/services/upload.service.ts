import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MidiaCriada, RegistroMidia } from '../../shared/models/registro-midia';
import { LogsUploadResponse } from '../../shared/models/uploads.model';
import { keys } from '../../shared/utils';

@Injectable({
  providedIn: 'root',
})

export class UploadService{
    private baseUrl = environment.apiUrlMidia;
    private file: File | null = null;
    private dadosMidia!: RegistroMidia;
    private midiaCriada!: MidiaCriada;
    private idUpload!: string;

    constructor(private http: HttpClient){}

    getTiposDocumentos(): Observable<any>{
        return this.http.get(`${this.baseUrl}/midias/tipoDocumentos`)
    }

    getOrigens(): Observable<any>{
        return this.http.get(`${this.baseUrl}/midias/origemMidias`)
    }

    setFile(file: File) {
        this.file = file;
    }

    getFile(): File | null {
        return this.file;
    }

    setIdUpload(id: string){
        this.idUpload = id;
    }

    getIdUpload(): string {
        return this.idUpload;
    }

    getIdMidia(): number{
        if(!this.midiaCriada){
            throw new Error('ID da mídia não encontrado');
        }
        return this.midiaCriada?.id
    }

    clearFile() {
        this.file = null;
    }

    uploadMidia(body: any){
        return this.http.post(`${this.baseUrl}/midias/`, body)
    }

    uploadFile(metadata: { idMidia: number; extensao: string; fileName: string}, file: File): Observable<HttpEvent<string>>{
        const formData = new FormData();
        formData.append('metadata', JSON.stringify({ arquivoMetadata: metadata }));
        formData.append('file', file, metadata.fileName);

        const req = new HttpRequest<any>('POST', `${this.baseUrl}/midias/upload/uploadFile`, formData, {
            reportProgress: true,
            responseType: 'text'
        });
        return this.http.request<string>(req);

    }

    initiateUpload(file: File, idMidia: number): Observable<any> {
        const body = {
            arquivoMetadata: {
                extensao: file.name.split('.').pop(),
                fileName: file.name,
                idMidia: idMidia,
            }
        };

        return this.http.post(`${this.baseUrl}/midias/upload/initiate`, body, {
            responseType: 'text'
        })
    }

    uploadPart(formData: FormData): Promise<HttpResponse<string>>{
        return this.http.patch<string>(`${this.baseUrl}/midias/upload/multipart`, formData, {
            observe: 'response' as 'response',
            responseType: 'text' as 'json',
        }).toPromise() as Promise<HttpResponse<string>>;
    }

    setDadosMidia(dados: RegistroMidia){
        this.dadosMidia = dados;
    }

    setMidiaCriada(midia: MidiaCriada){
        this.midiaCriada = midia
    }

    getDadosMidia(): RegistroMidia {
        return this.dadosMidia
    }

    getLogsUpload(id: number, page?: number, filtros?: string): Observable<LogsUploadResponse>{
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem(keys.TOKEN)}`,
        });
        return this.http.get<LogsUploadResponse>(`${this.baseUrl}/midias/logs/${id}?page=${page}&size=6&${filtros}`, { headers });
    }
}