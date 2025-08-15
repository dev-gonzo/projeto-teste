import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnderecoService } from './endereco.service';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Endereco, Municipio, Uf } from '../../shared/models';

describe('EnderecoService', () => {
  let service: EnderecoService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrl = `${environment.apiUrl}/endereco`;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EnderecoService,
        { provide: AuthService, useValue: spy }
      ],
    });

    service = TestBed.inject(EnderecoService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('getUFs', () => {
    it('deve buscar todas as UFs com o Bearer Token no cabeçalho', () => {
      const mockUfs: Uf[] = [{ id: 1, sigla: 'SP', nome: 'São Paulo', codigoIbge: 35 } as Uf];
      authServiceSpy.getToken.and.returnValue('fake-token');

      service.getUFs().subscribe((data) => {
        expect(data).toEqual(mockUfs);
      });

      const req = httpMock.expectOne(`${apiUrl}/ufs`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
      req.flush(mockUfs);
    });

    it('deve buscar todas as UFs sem o Bearer Token quando não houver token', () => {
      const mockUfs: Uf[] = [{ id: 1, sigla: 'SP', nome: 'São Paulo', codigoIbge: 35 } as Uf];
      authServiceSpy.getToken.and.returnValue(null);

      service.getUFs().subscribe((data) => {
        expect(data).toEqual(mockUfs);
      });

      const req = httpMock.expectOne(`${apiUrl}/ufs`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockUfs);
    });
  });

  describe('getMunicipiosPorNome', () => {
    it('deve buscar municípios por nome com o Bearer Token no cabeçalho', () => {
      const mockMunicipios: Municipio[] = [{
        id: 1,
        nome: 'São Paulo',
        codigoIbge: 3550308,
        uf: { id: 1, sigla: 'SP', nome: 'São Paulo', codigoIbge: 35 }
      } as Municipio];
      authServiceSpy.getToken.and.returnValue('fake-token');

      service.getMunicipiosPorNome('São').subscribe((data) => {
        expect(data).toEqual(mockMunicipios);
      });

      const req = httpMock.expectOne(`${apiUrl}/municipio/São`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
      req.flush(mockMunicipios);
    });

    it('deve buscar municípios por nome sem o Bearer Token quando não houver token', () => {
      const mockMunicipios: Municipio[] = [{
        id: 1,
        nome: 'São Paulo',
        codigoIbge: 3550308,
        uf: { id: 1, sigla: 'SP', nome: 'São Paulo', codigoIbge: 35 }
      } as Municipio];
      authServiceSpy.getToken.and.returnValue(null);

      service.getMunicipiosPorNome('São').subscribe((data) => {
        expect(data).toEqual(mockMunicipios);
      });

      const req = httpMock.expectOne(`${apiUrl}/municipio/São`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockMunicipios);
    });
  });

  describe('getEnderecoPorCEP', () => {
    const mockApiResponse = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107',
      estado: 'São Paulo'
    };

    const expectedEndereco: Endereco = {
      id: 0,
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      bairro: 'Sé',
      complemento: 'lado ímpar',
      municipio: {
        id: 0,
        codigoIbge: 3550308,
        nome: 'São Paulo',
        uf: {
          id: 0,
          codigoIbge: 35,
          nome: 'São Paulo',
          sigla: 'SP'
        }
      },
      erro: false,
    };

    it('deve buscar endereço por CEP e mapear a resposta corretamente (com Bearer Token)', () => {
      authServiceSpy.getToken.and.returnValue('fake-token');
      const cep = '01001000';
      
      service.getEnderecoPorCEP(cep).subscribe(endereco => {
        expect(endereco).toEqual(expectedEndereco);
      });

      const req = httpMock.expectOne(`${apiUrl}/cep/${cep}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
      req.flush(mockApiResponse);
    });

    it('deve buscar endereço por CEP sem o Bearer Token quando não houver token', () => {
      authServiceSpy.getToken.and.returnValue(null);
      const cep = '01001000';

      service.getEnderecoPorCEP(cep).subscribe(endereco => {
        expect(endereco).toEqual(expectedEndereco);
      });

      const req = httpMock.expectOne(`${apiUrl}/cep/${cep}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockApiResponse);
    });
  });
});
