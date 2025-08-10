import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedService],
    });
    service = TestBed.inject(SharedService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('eventos de login', () => {
    it('deve emitir um evento no observable login$ quando triggerLoginEvent for chamado', (done: DoneFn) => {
      service.login$.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      service.triggerLoginEvent();
    });
  });

  describe('eventos de registro', () => {
    it('deve emitir um evento no observable register$ quando triggerRegisterEvent for chamado', (done: DoneFn) => {
      service.register$.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      service.triggerRegisterEvent();
    });
  });
});