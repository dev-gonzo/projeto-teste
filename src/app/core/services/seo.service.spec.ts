import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';

import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let metaSpy: jasmine.SpyObj<Meta>;
  let titleServiceSpy: jasmine.SpyObj<Title>;

  beforeEach(() => {
    const metaSpyObj = jasmine.createSpyObj('Meta', ['updateTag']);
    const titleSpyObj = jasmine.createSpyObj('Title', ['setTitle']);

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Meta, useValue: metaSpyObj },
        { provide: Title, useValue: titleSpyObj },
      ],
    });

    service = TestBed.inject(SeoService);
    metaSpy = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    titleServiceSpy = TestBed.inject(Title) as jasmine.SpyObj<Title>;
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('setMetaDescription', () => {
    it('deve chamar meta.updateTag com os atributos corretos para a descrição', () => {
      const mockContent = 'Esta é uma descrição de teste para a página.';
      const expectedTag = {
        name: 'description',
        content: mockContent,
      };

      service.setMetaDescription(mockContent);

      expect(metaSpy.updateTag).toHaveBeenCalledOnceWith(expectedTag);
    });
  });

  describe('setMetaTitle', () => {
    it('deve chamar titleService.setTitle com o título correto', () => {
      const mockTitle = 'Título da Página de Teste';

      service.setMetaTitle(mockTitle);

      expect(titleServiceSpy.setTitle).toHaveBeenCalledOnceWith(mockTitle);
    });
  });
});