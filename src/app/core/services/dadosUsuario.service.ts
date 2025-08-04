import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../../shared/models';
import { keys } from '../../shared/utils/variables';



@Injectable({
  providedIn: 'root',
})
export class DadosUsuarioService {
    constructor( private readonly http: HttpClient){}
    private readonly baseUrl = environment.apiUrl;
    private readonly token = localStorage.getItem(keys.TOKEN)

    getDadosUsuario(): Observable<any>{
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.get(`${this.baseUrl}/cadastros/auth/account`, { headers })
    }

    getFoto(idFoto: string): Observable<Blob>{
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.get<Blob>(`${this.baseUrl}/cadastros/fotos/${idFoto}`, { headers, responseType: 'blob' as 'json'});
    }

    postFoto(id: number, formData: any): Observable<any>{
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.post(`${this.baseUrl}/cadastros/fotos/upload/${id}`, formData, { headers, responseType: 'text' })
    }

    formataDados(dados: Usuario){
        dados.sexo = dados.sexo === 'M' ? 'Masculino' : 'Feminino';
        const dataFormatada = dados.dataNascimento 
            ? this.formatarData(dados.dataNascimento) 
            : 'Data não disponível';
        dados.dataNascimento = dataFormatada;
        const celularFormatado = dados.celularDDD && dados.celular ? this.formatarCelular(dados.celularDDD, dados.celular) : 'Celular não disponivel';
        dados.celular = celularFormatado
        const cpfFormatado = dados.cpf ? this.formatarCPF(dados.cpf) : 'CPF não disponível';
        dados.cpf = cpfFormatado
        const telefoneFormatado = dados.telefoneDDD && dados.telefone ? this.formatarTelefone(dados.telefoneDDD, dados.telefone) : '';
        dados.telefone = telefoneFormatado
        const nome = dados.nome
        dados.nome = nome
        return dados
    }

    formatarData(dataNascimento: string) {
        return dataNascimento.split("-").reverse().join("/"); 
    }

    formatarCelular(celularDDD: string, celular: string) {
        return `(${celularDDD}) ${celular.slice(0, 5)}-${celular.slice(5)}`;
    }

    formatarTelefone(telefoneDDD: string, telefone: string) {
        return `(${telefoneDDD}) ${telefone.slice(0, 4)}-${telefone.slice(4)}`;
    }

    formatarCPF(cpf: string) {
        return cpf.replace(/\D/g, '')
                  .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    formataDadosParaAPI(dadosForm: any, configForm: any, dados: Usuario): Usuario{
        const nascimento = dadosForm.nascimento;
        const [dia, mes, ano] = nascimento.split('/');
        const formattedDate = `${ano}-${mes}-${dia}`;
        const celularDDD = dadosForm.celular ? dadosForm.celular.split(' ')[0].replace(/\D/g, '') : '';
        const cpfFormatado = dadosForm.cpf.replace(/[.\-]/g, '');
        const celularSemDDD = dadosForm.celular.replace(/\D/g, '').slice(2);
        const telefoneSemDDD = dadosForm.telefone.replace(/\D/g, '').slice(2);
        const sexoFormatado = dadosForm.sexo === 'Masculino' ? 'M' : 'F';
        return {
              nome: dadosForm.nome,
              perfil: dados.perfil,
              cargo: configForm.cargos,
              celular: celularSemDDD,
              celularDDD: celularDDD,
              sexo: sexoFormatado,
              cpf: cpfFormatado,
              email: dados.email,
              dataNascimento: formattedDate,
              unidadeOperacionalPrincipal: {id:dados.unidadeOperacionalPrincipal.id, nomeUnidadeOperacional: dados.unidadeOperacionalPrincipal.nomeUnidadeOperacional},
              unidadesOperacionais: configForm.unidadesOperacionais,
              telefone: telefoneSemDDD,
        }
    }
}