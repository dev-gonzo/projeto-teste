import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { MunicipioService } from './municipio.service';
import { environment } from '../../../environments/environment';
import { Municipio } from '../../shared/models';

interface AbstractModel<T> {
  id: T;
}

interface Uf extends AbstractModel<number> {
  codigoIbge: number;
  nome: string;
  sigla: string;
}

describe('MunicipioService', () => {
  let service: MunicipioService;
  let httpTestingController: HttpTestingController;
  const endpoint = `${environment.apiUrl}/municipio`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MunicipioService],
    });
    service = TestBed.inject(MunicipioService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('query', () => {
    it('deve fazer uma requisição GET com o parâmetro de consulta "nome" e retornar uma lista de municípios', () => {
      const nomeQuery = 'São';
      const mockUf: Uf = { id: 25, codigoIbge: 35, nome: 'São Paulo', sigla: 'SP' };
      const mockMunicipios: Municipio[] = [
        { id: 1, codigoIbge: 3550308, nome: 'São Paulo', uf: mockUf },
        { id: 2, codigoIbge: 3548801, nome: 'São Caetano do Sul', uf: mockUf },
      ];

      service.query(nomeQuery).subscribe((municipios) => {
        expect(municipios).toEqual(mockMunicipios);
        expect(municipios.length).toBe(2);
        expect(municipios[0].uf.codigoIbge).toBe(35);
        expect(municipios[0].uf.sigla).toBe('SP');
      });

      const req = httpTestingController.expectOne(
        request => request.url === endpoint && request.params.get('nome') === nomeQuery
    );

      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('nome')).toBe(nomeQuery);

      req.flush(mockMunicipios);
    });

    it('deve retornar um array vazio se a consulta não encontrar resultados', () => {
      const nomeQuery = 'CidadeInexistente';
      const mockMunicipios: Municipio[] = [];

      service.query(nomeQuery).subscribe((municipios) => {
        expect(municipios).toEqual([]);
        expect(municipios.length).toBe(0);
      });

      const req = httpTestingController.expectOne(
        request => request.url === endpoint && request.params.get('nome') === nomeQuery
    );
      expect(req.request.method).toBe('GET');

      req.flush(mockMunicipios);
    });
  });
});