import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CodeInputModule } from 'angular-code-input';
import { of, throwError, Subscription } from 'rxjs';

import { AuthService, SharedService } from '../../../core/services';
import { ValidateTokenComponent } from './validate-token.component';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/services/token.service';

describe('ValidateTokenComponent', () => {
  let component: ValidateTokenComponent;
  let fixture: ComponentFixture<ValidateTokenComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;
  let sharedService: SharedService;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getMensagemLogin',
      'getAppToken',
      'setAppToken',
      'setPermissaoPerfil',
      'isAuthenticatedUser',
      'isAuthenticatedToken',
    ]);
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['validateToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ValidateTokenComponent,
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        CodeInputModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: SharedService,
          useValue: {
            login$: of(),
          },
        },
      ],
    }).compileComponents();

    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIconPacks(fas);

    fixture = TestBed.createComponent(ValidateTokenComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    sharedService = TestBed.inject(SharedService);
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve obter a mensagem de login e o token do authService', () => {
      authService.getMensagemLogin.and.returnValue('Bem-vindo!');
      authService.getAppToken.and.returnValue('fake-app-token');

      fixture.detectChanges();

      expect(authService.getMensagemLogin).toHaveBeenCalled();
      expect(component.mensagemLogin).toBe('Bem-vindo!');
      expect(authService.getAppToken).toHaveBeenCalled();
      expect(component.token).toBe('fake-app-token');
    });

    it('deve iniciar o cooldown na inicialização', () => {
      spyOn(component, 'startCooldown');
      fixture.detectChanges();
      expect(component.startCooldown).toHaveBeenCalled();
    });

    it('deve navegar para / se o usuário não estiver autenticado', () => {
      authService.getAppToken.and.returnValue(null);
      authService.isAuthenticatedUser.and.returnValue(false);
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('não deve navegar se um token existir', () => {
      authService.getAppToken.and.returnValue('existing-token');
      fixture.detectChanges();
      expect(router.navigate).not.toHaveBeenCalledWith(['/auth/validar-token']);
    });
  });

  describe('ngOnDestroy', () => {
    it('deve limpar o intervalo do cooldown e a subscrição ao ser destruído', () => {
      const clearIntervalSpy = spyOn(window, 'clearInterval');
      component.ngOnInit();
      const unsubscribeSpy = spyOn((component as any).loginSubscription, 'unsubscribe');
      
      component.startCooldown();
      component.ngOnDestroy();

      expect(clearIntervalSpy).toHaveBeenCalledWith((component as any).intervalId);
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmitCodigo', () => {
    beforeEach(() => {
      authService.getAppToken.and.returnValue('initial-token');
      fixture.detectChanges();
    });

    it('não deve fazer nada se o formulário for inválido', () => {
      component.codigoForm.setValue({ codigo: '' });
      component.onSubmitCodigo();
      expect(tokenService.validateToken).not.toHaveBeenCalled();
    });

    it('deve validar o token, definir sessão, e navegar para /home em caso de sucesso', () => {
      const mockResponse = {
        ativado: true,
        mensagem: 'Sucesso!',
        perfil: 'admin',
        token: 'new-session-token',
      };
      tokenService.validateToken.and.returnValue(of(mockResponse));
      component.codigoForm.setValue({ codigo: '123456' });
      
      component.onSubmitCodigo();

      expect(tokenService.validateToken).toHaveBeenCalledWith({ codigo: '123456', token: 'initial-token' });
      expect(authService.setAppToken).toHaveBeenCalledWith('new-session-token');
      expect(authService.setPermissaoPerfil).toHaveBeenCalledWith('admin');
      expect(component.successMessage).toBe('Sucesso!');
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('deve exibir mensagem de erro se a resposta não indicar ativação', () => {
      const mockResponse = {
        ativado: false,
        mensagem: 'Falha',
        perfil: '',
        token: '',
      };
      tokenService.validateToken.and.returnValue(of(mockResponse));
      component.codigoForm.setValue({ codigo: '123456' });

      component.onSubmitCodigo();

      expect(component.errorMessage).toBe('Token inválido ou não ativado.');
      expect(authService.setAppToken).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.sendingRequest).toBe(false);
    });

    it('deve exibir mensagem de erro em caso de falha na API', () => {
      tokenService.validateToken.and.returnValue(throwError(() => new Error('API Error')));
      component.codigoForm.setValue({ codigo: '123456' });

      component.onSubmitCodigo();

      expect(component.errorMessage).toBe('Erro ao validar o token. Solicite um novo para continuar.');
      expect(authService.setAppToken).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.sendingRequest).toBe(false);
    });
  });

  describe('Lógica do Cooldown', () => {
    it('deve iniciar o cooldown com 300 segundos e formatar o tempo', fakeAsync(() => {
      component.startCooldown();
      expect(component.cooldownTime).toBe(300);
      expect(component.formattedCooldownTime).toBe('5:00');

      tick(1000);
      expect(component.cooldownTime).toBe(299);
      expect(component.formattedCooldownTime).toBe('4:59');

      tick(299000);
      expect(component.cooldownTime).toBe(0);
      expect(component.cooldown).toBeTrue();

      clearInterval((component as any).intervalId);
    }));
  });

  describe('Interações e Navegação', () => {
    it('deve navegar para /auth/login ao chamar reset()', () => {
      component.reset();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('deve atualizar o formulário de código quando onCodeChanged é chamado', () => {
      component.onCodeChanged('987');
      expect(component.codigoForm.value.codigo).toBe('987');
    });
  });
});