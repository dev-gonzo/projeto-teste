import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CodeInputModule } from 'angular-code-input';
import { Subject } from 'rxjs';

import { AuthService, SharedService } from '../../../core/services';
import { TokenService } from '../../../core/services/token.service';
import { ValidateTokenComponent } from './validate-token.component';

describe('ValidateTokenComponent', () => {
  let component: ValidateTokenComponent;
  let fixture: ComponentFixture<ValidateTokenComponent>;
  let authService: AuthService;
  let tokenService: TokenService;
  let router: Router;
  let sharedService: SharedService;

  let mockAuthService: any;
  let mockTokenService: any;
  let mockRouter: any;
  let mockSharedService: any;

  beforeEach(async () => {
    mockAuthService = {
      getAppToken: jasmine.createSpy('getAppToken').and.returnValue(null),
      isAuthenticatedUser: jasmine.createSpy('isAuthenticatedUser').and.returnValue(true),
      isAuthenticatedToken: jasmine.createSpy('isAuthenticatedToken').and.returnValue(false),
      setAppToken: jasmine.createSpy('setAppToken'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    mockSharedService = {
      login$: new Subject<void>(),
    };

    mockTokenService = {
      requestToken: jasmine.createSpy('requestToken').and.callFake((body: { email: string }) => {
        if (body.email === 'sucesso@teste.com') {
          return Promise.resolve({ jwt: 'fake-jwt', mensagem: 'Token enviado' });
        }
        if (body.email === 'limite@teste.com') {
          return Promise.resolve({ jwt: 'fake-jwt-limite', mensagem: 'O usuário está dentro do limite de 24hr.' });
        }
        return Promise.reject({ erro: 'E-mail não encontrado' });
      }),
      validateToken: jasmine.createSpy('validateToken').and.callFake((body: { jwt: string; token: string }) => {
        if (body.token === '123456') {
          return Promise.resolve('Token validado com sucesso');
        }
        return Promise.reject('Token inválido');
      }),
      setToken: jasmine.createSpy('setToken'),
      getToken: jasmine.createSpy('getToken').and.returnValue('fake-jwt'),
    };

    await TestBed.configureTestingModule({
      imports: [
        ValidateTokenComponent,
        ReactiveFormsModule,
        FontAwesomeModule,
        CodeInputModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SharedService, useValue: mockSharedService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compileComponents();

    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIconPacks(fas);

    fixture = TestBed.createComponent(ValidateTokenComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
    sharedService = TestBed.inject(SharedService);

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve navegar para /home se getAppToken retornar um token', () => {
      mockAuthService.getAppToken.and.returnValue('some-app-token');
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('deve navegar para / se o usuário não estiver autenticado', () => {
      mockAuthService.isAuthenticatedUser.and.returnValue(false);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('deve limpar a mensagem de erro quando login$ emitir um evento', () => {
      component.errorMessage = 'Erro antigo';
      (sharedService.login$ as Subject<void>).next();
      expect(component.errorMessage).toBe('');
    });
  });

  describe('ngOnDestroy', () => {
    it('deve limpar o intervalo do cooldown e a subscrição ao ser destruído', () => {
      const clearIntervalSpy = spyOn(window, 'clearInterval');
      const unsubscribeSpy = spyOn((component as any).loginSubscription, 'unsubscribe');

      component.startCooldown();
      fixture.destroy();

      expect(clearIntervalSpy).toHaveBeenCalledWith((component as any).intervalId);
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Passo 0: Solicitação de E-mail', () => {
    it('deve avançar para o passo 1 e iniciar o cooldown em caso de sucesso', fakeAsync(() => {
      component.mailForm.setValue({ email: 'sucesso@teste.com' });
      const startCooldownSpy = spyOn(component, 'startCooldown').and.callThrough();

      component.onSubmitEmail();
      tick();

      expect(component.step).toBe(1);
      expect(component.successMessage).toBe('Token enviado');
      expect(startCooldownSpy).toHaveBeenCalled();
      fixture.destroy();
    }));

    it('deve exibir mensagem de erro se o e-mail não for encontrado', fakeAsync(() => {
      component.mailForm.setValue({ email: 'falha@teste.com' });
      component.onSubmitEmail();
      tick();
      expect(component.step).toBe(0);
      expect(component.errorMessage).toContain('E-mail não encontrado');
    }));

    it('deve exibir mensagem sobre limite de 24h e não avançar o passo', fakeAsync(() => {
      component.mailForm.setValue({ email: 'limite@teste.com' });
      component.onSubmitEmail();
      tick();
      expect(component.step).toBe(0);
      expect(component.successMessage).toContain('Você já solicitou um token recentemente');
    }));
  });

  describe('Passo 1: Validação do Token', () => {
    beforeEach(() => {
      component.step = 1;
    });

    it('deve validar o token, exibir sucesso e redirecionar após 2 segundos', fakeAsync(() => {
      component.tokenForm.setValue({ token: '123456' });

      component.onSubmitToken();
      tick();

      expect(component.successMessage).toBe('Token validado com sucesso');
      tick(2000);
      expect(authService.setAppToken).toHaveBeenCalledWith('token_validated');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('deve exibir mensagem de erro para um token inválido', fakeAsync(() => {
      component.tokenForm.setValue({ token: '654321' });
      component.onSubmitToken();
      tick();
      expect(component.errorMessage).toContain('Token inválido ou expirado');
    }));
  });

  describe('Lógica do Cooldown e Reset', () => {
    it('deve iniciar o cooldown e formatar o tempo corretamente', fakeAsync(() => {
      component.startCooldown();
      expect(component.cooldownTime).toBe(120);
      expect(component.formattedCooldownTime).toBe('2:00');

      tick(1000);
      expect(component.cooldownTime).toBe(119);
      expect(component.formattedCooldownTime).toBe('1:59');

      tick(59000);
      expect(component.cooldownTime).toBe(60);
      expect(component.formattedCooldownTime).toBe('1:00');

      fixture.destroy();
    }));

    it('deve habilitar a solicitação de novo token (cooldown=true) quando o tempo acabar', fakeAsync(() => {
      component.startCooldown();
      tick(120000);
      expect(component.cooldown).toBeTrue();
    }));

    it('deve resetar o estado ao clicar em "Solicitar novo token"', () => {
      component.step = 1;
      component.startCooldown();
      const clearIntervalSpy = spyOn(window, 'clearInterval');

      component.resetToken();

      expect(component.step).toBe(0);
      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('');
      expect(clearIntervalSpy).toHaveBeenCalledWith((component as any).intervalId);
    });
  });

  describe('Interações e Navegação', () => {
    it('deve navegar para login ao chamar reset()', () => {
      component.reset();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('deve atualizar o formulário de token quando onCodeChanged é chamado', () => {
      component.onCodeChanged('123');
      expect(component.tokenForm.value.token).toBe('123');
    });
  });
});