import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DadosBasicos, Oitiva, OitivaCriacaoResponse, OitivaGeral, ResponseSuccessHttp, UsuarioBasico, LogsOitivaResponse, DetalhesOitiva, TranscricaoOitiva, ResponseTranscricaoOitiva } from '../../shared/models';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { keys } from '../../shared/utils/variables';
import { SituacaoOitiva, StatusProcessamento } from '../../shared/enums';
import { UsuarioApiService } from './usuario.service';


@Injectable({
  providedIn: 'root',
})

export class OitivaService{

    private baseUrl = environment.apiUrlMidia;
    private url = environment.apiUrl;
    constructor(private http: HttpClient, private usuarioService: UsuarioApiService) {
    }

    private dadosOitiva!: DadosBasicos
    private idMicDelegado!: string
    private idMicDepoente!: string
    private idCamera!: string
    private token = localStorage.getItem(keys.TOKEN)
    private idOitiva!: number

    setDadosOitiva(dados: any){
        this.dadosOitiva = dados
    }

    async prepare() {
      await this.usuarioService.findById(this.dadosOitiva.digitador.id).subscribe((response) => {
        this.dadosOitiva.digitador.delegaciaPrincipal = { id: response.delegaciaPrincipal.id ?? 0 };
      });
      await this.usuarioService.findById(this.dadosOitiva.delegado.id).subscribe((response) => {
        this.dadosOitiva.delegado.delegaciaPrincipal = { id: response.delegaciaPrincipal.id ?? 0 };
      });
    }

    getDadosOitiva() {
       this.prepare();
      return this.dadosOitiva
    }

    setPerifericos(micDelegado: string, micDepoente: string, camera: string){
        this.idMicDelegado = micDelegado
        this.idMicDepoente = micDepoente
        this.idCamera = camera

    }

    getPerifericos() {
        return {
            micDelegado: this.idMicDelegado,
            micDepoente: this.idMicDepoente,
            camera: this.idCamera
        }
    }

    getOitivasGravadas(filtros?: string, page?: number): Observable<Oitiva> {
        const headers = new HttpHeaders().set('No-Auth', 'true')
        if(filtros){
            return this.http.get<Oitiva>(`${this.baseUrl}/midias/oitivas/?page=${page}&size=6&${filtros}`, {headers})
        }
        return this.http.get<Oitiva>(`${this.baseUrl}/midias/oitivas/findall?page=${page}&size=6`, {headers})
    }

    obterStatusProcessamento(situacao: string): StatusProcessamento {
        const situacoesProcessado = [
          SituacaoOitiva.Disponivel,
          SituacaoOitiva.Aguardando,
          SituacaoOitiva.Transcrevendo,
          SituacaoOitiva.Aprovada,
          SituacaoOitiva.VideoSemAudio,
          SituacaoOitiva.TentativasEsgotadas,
          SituacaoOitiva.MidiaSemAudio,
          SituacaoOitiva.Editando
        ];
      
        if (situacao === SituacaoOitiva.AguardandoProcessamento) {
          return StatusProcessamento.Processando;
        } else if (situacao === SituacaoOitiva.ErroTranscricao) {
          return StatusProcessamento.ErroProcessamento;
        } else if (situacoesProcessado.includes(situacao as SituacaoOitiva)) {
          return StatusProcessamento.Processado;
        }
      
        return StatusProcessamento.Desconhecido;
    }

    getDepoentes(idDelegacia: number): Observable<UsuarioBasico> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
      })
        return this.http.get<UsuarioBasico>(`${this.url}/cadastros/usuarios/list/?idDelegacia=${idDelegacia}`, {headers})
    }

    getLogsOitiva(id: number, page?: number, filtros?: string): Observable<LogsOitivaResponse> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`,
        });
        return this.http.get<LogsOitivaResponse>(`${this.baseUrl}/midias/oitivas/logs/${id}?page=${page}&size=6&${filtros}`, { headers })
    }


    criarOitiva(body: OitivaGeral): Observable<OitivaCriacaoResponse> {
      return forkJoin([
        this.usuarioService.findById(this.dadosOitiva.delegado.id),
        this.usuarioService.findById(this.dadosOitiva.digitador.id)
      ]).pipe(
        switchMap(([delegadoResponse, digitadorResponse]) => {
          body.delegado.delegaciaPrincipal = { id: delegadoResponse.delegaciaPrincipal.id ?? 0 };
          body.digitador.delegaciaPrincipal = { id: digitadorResponse.delegaciaPrincipal.id ?? 0 };
          return this.http.post<OitivaCriacaoResponse>(`${this.baseUrl}/midias/oitivas`, body);
        })
      );
    }

    enviarDatasDaOitiva(inicio: string, fim: string, duracao: string, id: number): Observable<ResponseSuccessHttp>{
      const body = {
        dataInicioDepoimento: inicio,
        dataFimDepoimento: fim,
        tempoDuracaoDepoimento: duracao
      }
      return this.http.put<ResponseSuccessHttp>(`${this.baseUrl}/midias/oitivas/${id}`, body)
    }

    enviarZip(file: Blob, id: number) : Observable<string> {
      const formData = new FormData();
      formData.append('zipFile', file)
      return this.http.post(`${this.baseUrl}/midias/upload-oitiva/${id}/upload-zip`, formData, { responseType: 'text' }) as Observable<string>;
    }
    
    setIdOitiva(id: number) {
      this.idOitiva = id
    }

    getIdOitiva() {
      return this.idOitiva
    }

    getDetalhesOitiva(id: number): Observable<DetalhesOitiva>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
      });

      return this.http.get<ResponseTranscricaoOitiva>(`${this.baseUrl}/midias/upload-oitiva/videos/${id}`, {headers}).pipe(
        map(response => {
          return {
            ...response,
            transcricao: JSON.parse(response.transcricao) as TranscricaoOitiva[]
          }
        })
      )
    }

}