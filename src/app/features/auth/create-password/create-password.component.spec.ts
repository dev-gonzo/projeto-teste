import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, Subscription } from 'rxjs';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CreatePasswordComponent } from './create-password.component';
import { RecuperarSenhaService } from '../../../core/services';

class MockRecuperarSenhaService {
  validarRecuperacaoSenha(token: string, password: string) {
    if (password === 'ValidPass123!') {
      return of({ mensagem: 'Senha cadastrada com sucesso.' });
    }
    return throwError(() => ({ error: { message: 'Token inválido ou expirado.' } }));
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('CreatePasswordComponent', () => {
  let component: CreatePasswordComponent;
  let fixture: ComponentFixture<CreatePasswordComponent>;
  let router: Router;
  let recuperarSenhaService: RecuperarSenhaService;

  const mockActivatedRoute = {
    queryParams: of({ c: 'um-token-jwt-mock' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreatePasswordComponent,
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule,
      ],
      providers: [
        { provide: RecuperarSenhaService, useClass: MockRecuperarSenhaService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIconPacks(fas);

    fixture = TestBed.createComponent(CreatePasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    recuperarSenhaService = TestBed.inject(RecuperarSenhaService);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('deve criar o componente com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve obter o TOKEN da URL na inicialização do componente', () => {
    expect(component.token).toBe('um-token-jwt-mock');
  });

  it('deve chamar o método "back" e navegar para a tela de login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.back();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('deve chamar verifyParams na inicialização e não deve redirecionar com token válido', () => {
    const navigateSpy = spyOn(router, 'navigate');
    spyOn(component, 'verifyParams').and.callThrough();
    component.ngOnInit();
    expect(component.verifyParams).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('deve redirecionar para /auth/login se o token não existir nos parâmetros', () => {
    const navigateSpy = spyOn(router, 'navigate');
    (component as any).token = '';
    component.verifyParams();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });


  describe('Validação do Formulário (passForm)', () => {
    it('deve iniciar com o formulário inválido', () => {
      expect(component.passForm.valid).toBeFalsy();
    });

    it('deve marcar o campo de senha como inválido se estiver vazio', () => {
      component.password.setValue('');
      expect(component.password.hasError('required')).toBeTruthy();
    });

    it('deve marcar o campo de senha como inválido se tiver menos de 6 caracteres', () => {
      component.password.setValue('aA1@');
      expect(component.password.hasError('minlength')).toBeTruthy();
    });

    it('deve marcar o campo de senha como inválido se não tiver um número', () => {
      component.password.setValue('SenhaSemNumero!');
      expect(component.password.hasError('requiresDigit')).toBeTruthy();
    });

    it('deve marcar o campo de senha como inválido se não tiver uma letra maiúscula', () => {
      component.password.setValue('senhasemupper1!');
      expect(component.password.hasError('requiresUppercase')).toBeTruthy();
    });

    it('deve marcar o campo de senha como inválido se não tiver uma letra minúscula', () => {
      component.password.setValue('SENHASEMLOWER1!');
      expect(component.password.hasError('requiresLowercase')).toBeTruthy();
    });

    it('deve marcar o campo de senha como inválido se não tiver um caractere especial', () => {
      component.password.setValue('SenhaSemEspecial1');
      expect(component.password.hasError('requiresSpecialChars')).toBeTruthy();
    });

    it('deve marcar o formulário como válido se todas as regras forem atendidas', () => {
      const validPassword = 'ValidPass123!';
      component.password.setValue(validPassword);
      component.password_confirm.setValue(validPassword);
      expect(component.passForm.valid).toBeTruthy();
    });

    it('deve exibir mensagem de erro quando as senhas são diferentes e o campo é tocado', fakeAsync(() => {
      component.password.setValue('ValidPass123!');
      component.password_confirm.setValue('DifferentPass123!');
      component.password_confirm.markAsTouched();
      tick();
      fixture.detectChanges();
      expect(component.errorMessageMatch).toBe('As senhas são diferentes.');
    }));

    it('deve limpar a mensagem de erro quando as senhas se tornam iguais', fakeAsync(() => {
      component.password.setValue('ValidPass123!');
      component.password_confirm.setValue('DifferentPass123!');
      component.password_confirm.markAsTouched();
      tick();
      fixture.detectChanges();
      expect(component.errorMessageMatch).toBe('As senhas são diferentes.');

      component.password_confirm.setValue('ValidPass123!');
      tick();
      fixture.detectChanges();
      expect(component.errorMessageMatch).toBe('');
    }));
  });

  describe('Interação com a Interface (UI)', () => {
    it('deve desabilitar o botão de submissão quando o formulário é inválido', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBeTrue();
    });

    it('deve habilitar o botão de submissão quando o formulário é válido', () => {
      const validPassword = 'ValidPass123!';
      component.password.setValue(validPassword);
      component.password_confirm.setValue(validPassword);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBeFalsy();
    });
  });

  describe('Lógica de Submissão', () => {
    it('deve chamar RecuperarSenhaService.validarRecuperacaoSenha ao submeter', () => {
      const criarSenhaSpy = spyOn(recuperarSenhaService, 'validarRecuperacaoSenha').and.callThrough();
      const validPassword = 'ValidPass123!';
      component.password.setValue(validPassword);
      component.password_confirm.setValue(validPassword);
      component.onSubmit();
      expect(criarSenhaSpy).toHaveBeenCalledWith('um-token-jwt-mock', validPassword);
    });

    it('deve exibir mensagem de sucesso e redirecionar após 2 segundos', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate');
      const validPassword = 'ValidPass123!';
      component.password.setValue(validPassword);
      component.password_confirm.setValue(validPassword);
      component.onSubmit();
      fixture.detectChanges();

      expect(component.successMessage).toContain('Senha cadastrada com sucesso.');
      expect(component.sendingRequest).toBe(false);

      tick(1999);
      expect(navigateSpy).not.toHaveBeenCalled();

      tick(1);
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    }));

    it('deve exibir mensagem de erro em caso de falha na submissão', () => {
      const password = 'anyInvalidPassword';
      component.password.setValue(password);
      component.password_confirm.setValue(password);
      component.onSubmit();
      fixture.detectChanges();

      expect(component.errorMessage).toContain('Token inválido ou expirado.');
      expect(component.successMessage).toBe('');
      expect(component.sendingRequest).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('deve desinscrever todas as subscrições', () => {
      const subscriptions = (component as any).subscriptions as Subscription;
      const unsubscribeSpy = spyOn(subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});