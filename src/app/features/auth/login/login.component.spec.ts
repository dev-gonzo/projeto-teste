import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subject, throwError, Subscription } from 'rxjs';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { provideNgxMask } from 'ngx-mask';

import { LoginComponent } from './login.component';
import { AuthService, SharedService } from '../../../core/services';

class MockAuthService {
  login(credentials: any) {
    return of({ success: true });
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockSharedService {
  login$ = new Subject<void>();
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let sharedService: SharedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule,
        FontAwesomeModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: SharedService, useClass: MockSharedService },
        provideNgxMask(), 
      ],
    }).compileComponents();

    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIconPacks(fas);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    sharedService = TestBed.inject(SharedService);

    fixture.detectChanges(); 
  });

  afterEach(() => {
    fixture.destroy();  
  });

  it('deve criar o componente com sucesso', () => {
    expect(component).toBeTruthy();
  });

  describe('Formulário de Credenciais (credentialsForm)', () => {
    it('deve iniciar com o formulário inválido', () => {
      expect(component.credentialsForm.valid).toBeFalsy();
    });

    it('deve marcar o formulário como inválido se o CPF estiver vazio', () => {
      component.credentialsForm.controls['senha'].setValue('123456');
      expect(component.credentialsForm.valid).toBeFalsy();
      expect(component.credentialsForm.controls['cpf'].hasError('required')).toBeTruthy();
    });

    it('deve marcar o formulário como inválido se a senha estiver vazia', () => {
      component.credentialsForm.controls['cpf'].setValue('12345678900');
      expect(component.credentialsForm.valid).toBeFalsy();
      expect(component.credentialsForm.controls['senha'].hasError('required')).toBeTruthy();
    });

    it('deve marcar o formulário como válido quando CPF e senha são preenchidos', () => {
      component.credentialsForm.controls['cpf'].setValue('12345678900');
      component.credentialsForm.controls['senha'].setValue('123456');
      expect(component.credentialsForm.valid).toBeTruthy();
    });
  });

  describe('Interação com a UI (Interface do Usuário)', () => {
    it('deve desabilitar o botão de "Entrar" se o formulário for inválido', () => {
      const button = fixture.nativeElement.querySelector('button.bg-sky-600');
      expect(button.disabled).toBeTrue();
    });

    it('deve habilitar o botão de "Entrar" se o formulário for válido', () => {
      component.credentialsForm.controls['cpf'].setValue('12345678900');
      component.credentialsForm.controls['senha'].setValue('123456');
      fixture.detectChanges(); 

      const button = fixture.nativeElement.querySelector('button.bg-sky-600');
      expect(button.disabled).toBeFalsy();
    });

    it('deve exibir mensagem de erro quando a propriedade errorMessage é definida', () => {
      component.errorMessage = 'Teste de erro';
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.text-red-600');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Teste de erro');
    });

    it('deve mostrar o spinner de carregamento durante o envio da requisição', () => {
      component.sendingRequest = true;
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('svg.animate-spin');
      const buttonText = fixture.nativeElement.querySelector('ng-template[#sendingRequestElse]');
      
      expect(spinner).toBeTruthy();
      expect(buttonText).toBeFalsy();  
    });
  });

  describe('Lógica de Submissão e Serviços', () => {
    beforeEach(() => {
      component.credentialsForm.controls['cpf'].setValue('12345678900');
      component.credentialsForm.controls['senha'].setValue('minhasenha');
      fixture.detectChanges();
    });
    
    it('deve exibir mensagem de erro genérica em caso de erro na chamada do serviço', fakeAsync(() => {
      spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Erro de rede')));

      component.onSubmit();
      tick(1000);
      fixture.detectChanges();

      expect(component.errorMessage).toBe('Dados de login incorretos. Tente novamente.');
      expect(component.successMessage).toBe('');
      expect(component.sendingRequest).toBeFalse();
    }));
  });

  describe('Ciclo de Vida do Componente', () => {
    it('deve se desinscrever do sharedService.login$ ao ser destruído', () => {
      const subscription = (component as any).loginEventSubscription as Subscription;
      const unsubscribeSpy = spyOn(subscription, 'unsubscribe');

      fixture.destroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});