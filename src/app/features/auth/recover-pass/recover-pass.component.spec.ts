import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subject, Subscription, throwError } from 'rxjs';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CodeInputModule } from 'angular-code-input';

import { RecoverPassComponent } from './recover-pass.component';
import { AuthService, EmailService, SharedService } from '../../../core/services';

class MockAuthService {}

class MockRouter {
  navigate(path: string[]) {}
}

class MockSharedService {
  login$ = new Subject<void>();
}

class MockEmailService {
  enviarEmail(email: string) {
    if (email === 'sucesso@teste.com') {
      return of('E-mail de recuperação enviado.');
    }
    return throwError(() => new Error('E-mail não encontrado'));
  }
}

describe('RecoverPassComponent', () => {
  let component: RecoverPassComponent;
  let fixture: ComponentFixture<RecoverPassComponent>;
  let emailService: EmailService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecoverPassComponent, 
        ReactiveFormsModule,
        FontAwesomeModule,
        CodeInputModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: SharedService, useClass: MockSharedService },
        { provide: EmailService, useClass: MockEmailService },
      ],
    }).compileComponents();

    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIconPacks(fas);

    fixture = TestBed.createComponent(RecoverPassComponent);
    component = fixture.componentInstance;
    emailService = TestBed.inject(EmailService);
    router = TestBed.inject(Router);
    fixture.detectChanges(); 
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve navegar para a tela de login ao clicar em voltar', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.back();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  describe('Formulário (mailForm)', () => {
    it('deve iniciar inválido', () => {
      expect(component.mailForm.valid).toBeFalsy();
    });

    it('deve ser inválido com um cpf de formato incorreto', () => {
      component.mailForm.controls['cpf'].setValue('345');
      expect(component.mailForm.valid).toBeFalsy();
    });

    it('deve ser válido com um cpf de formato correto', () => {
      component.mailForm.controls['cpf'].setValue('12345678904');
      expect(component.mailForm.valid).toBeTruthy();
    });
  });

  describe('Interação com a UI', () => {
    it('deve desabilitar o botão de envio se o formulário for inválido', () => {
      component.mailForm.controls['cpf'].setValue(null);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBeTrue();
    });

    it('deve desabilitar o botão de envio se o cooldown estiver ativo (canResend = false)', () => {
      component.mailForm.controls['cpf'].setValue('teste@valido.com');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBeTrue();
    });

    it('deve habilitar o botão de envio se o formulário for válido e o cooldown não estiver ativo (canResend = true)', () => {
      component.mailForm.controls['cpf'].setValue('teste@valido.com');
      component.canResend = true;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBeFalsy();
    });

    it('deve exibir mensagem de sucesso quando a propriedade successMessage for definida', () => {
      component.successMessage = 'Sucesso!';
      fixture.detectChanges();
      const successDiv = fixture.nativeElement.querySelector('.bg-green-100');
      expect(successDiv.textContent).toContain('Sucesso!');
    });

    it('deve exibir mensagem de erro quando a propriedade errorMessage for definida', () => {
      component.errorMessage = 'Erro!';
      fixture.detectChanges();
      const errorDiv = fixture.nativeElement.querySelector('.bg-red-100');
      expect(errorDiv.textContent).toContain('Erro!');
    });
  });

  describe('Lógica de Submissão', () => {
    it('deve chamar o serviço de e-mail, exibir mensagem de sucesso e iniciar o cooldown', () => {
      const emailSpy = spyOn(emailService, 'enviarEmail').and.callThrough();
      const cooldownSpy = spyOn(component as any, 'startCooldownTimer');
      
      component.mailForm.controls['cpf'].setValue('sucesso@teste.com');
      
      component.onSubmit();
      fixture.detectChanges();

      expect(emailSpy).toHaveBeenCalledWith('sucesso@teste.com');
      expect(component.successMessage).toBe('E-mail de recuperação enviado.');
      expect(component.errorMessage).toBe('');
      expect(component.sendingRequest).toBeFalse();
      expect(cooldownSpy).toHaveBeenCalled();
    });

    it('deve chamar o serviço de e-mail, exibir mensagem de erro e NÃO iniciar o cooldown', () => {
      const emailSpy = spyOn(emailService, 'enviarEmail').and.callThrough();
      const cooldownSpy = spyOn(component as any, 'startCooldownTimer');

      component.mailForm.controls['email'].setValue('falha@teste.com');
      
      component.onSubmit();
      fixture.detectChanges();

      expect(emailSpy).toHaveBeenCalledWith('falha@teste.com');
      expect(component.errorMessage).toBe('E-mail não compatível com registros do sistema.');
      expect(component.successMessage).toBe('');
      expect(component.sendingRequest).toBeFalse();
      expect(cooldownSpy).not.toHaveBeenCalled();
    });
  });

  describe('Ciclo de Vida', () => {
    it('deve cancelar a inscrição ao ser destruído', () => {
        const subscription = (component as any).subscription as Subscription;
        const unsubscribeSpy = spyOn(subscription, 'unsubscribe');
        
        component.ngOnDestroy(); 
        
        expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});