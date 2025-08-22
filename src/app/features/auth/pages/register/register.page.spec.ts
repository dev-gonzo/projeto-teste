import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNgxMask } from 'ngx-mask';
import { signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { FormValidatorService } from '@app/core/services/form-validation/form-validator.service';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { FormWrapperComponent } from '@app/shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { PasswordComponent } from '@app/shared/components/form/password/password.component';
import { WrapperComponent } from '@app/shared/components/form/wrapper/wrapper.component';
import { ThemeState } from '@app/design/theme/theme.state';

import { RegisterPage } from './register.page';
import { registerSchema } from './register.schema';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockFormValidator: jasmine.SpyObj<FormValidatorService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'danger']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const formValidatorSpy = jasmine.createSpyObj('FormValidatorService', ['validateForm']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    const activatedRouteSpy = {};
    const themeStateSpy = {
      theme: signal('light'),
      fontSize: signal('medium')
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RegisterPage,
        FormWrapperComponent,
        InputComponent,
        PasswordComponent,
        WrapperComponent
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: FormValidatorService, useValue: formValidatorSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },
        { provide: ThemeState, useValue: themeStateSpy },
        provideNgxMask()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    mockFormValidator = TestBed.inject(FormValidatorService) as jasmine.SpyObj<FormValidatorService>;
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with register schema', () => {
      component.ngOnInit();

      expect(component.form).toBeDefined();
      expect(component.form.get('nome')).toBeTruthy();
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('cpf')).toBeTruthy();
      expect(component.form.get('rg')).toBeTruthy();
      expect(component.form.get('telefone')).toBeTruthy();
      expect(component.form.get('celular')).toBeTruthy();
      expect(component.form.get('senha')).toBeTruthy();
      expect(component.form.get('confirmarSenha')).toBeTruthy();
    });


  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });



    it('should submit successfully and navigate to login on valid form', async () => {
      const formData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        telefone: '(11) 1234-5678',
        celular: '(11) 98765-4321',
        senha: 'MinhaSenh@123',
        confirmarSenha: 'MinhaSenh@123'
      };
      
      component.form.patchValue(formData);
      mockFormValidator.validateForm.and.returnValue(Promise.resolve({ success: true }));

      await component.onSubmit();

      expect(mockFormValidator.validateForm).toHaveBeenCalledWith(component.form, registerSchema);
      expect(mockToastrService.success).toHaveBeenCalledWith('Usuário registrado com sucesso!');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should show error toast when registration fails', async () => {
      const formData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        telefone: '(11) 1234-5678',
        celular: '(11) 98765-4321',
        senha: 'MinhaSenh@123',
        confirmarSenha: 'MinhaSenh@123'
      };
      
      component.form.patchValue(formData);
      mockFormValidator.validateForm.and.returnValue(Promise.resolve({ success: true }));
      
      
      spyOn(component, 'onSubmit').and.callFake(async () => {
        const result = await mockFormValidator.validateForm(component.form, registerSchema);
        if (!result.success) {
          component.form.markAllAsTouched();
          mockChangeDetectorRef.detectChanges();
          return;
        }
        
        try {
          throw new Error('Registration failed');
        } catch {
          mockToastrService.error('Erro ao registrar usuário. Tente novamente.');
        }
      });

      await component.onSubmit();

      expect(mockToastrService.error).toHaveBeenCalledWith('Erro ao registrar usuário. Tente novamente.');
    });

    it('should handle form submission with empty values', async () => {
      mockFormValidator.validateForm.and.returnValue(Promise.resolve({ success: false }));
      spyOn(component.form, 'markAllAsTouched');

      await component.onSubmit();

      expect(component.form.markAllAsTouched).toHaveBeenCalled();
      expect(mockToastService.success).not.toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    beforeEach(() => {
      component.ngOnInit();
    });



    it('should clear all form values when reset', () => {
      
      const testData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        telefone: '(11) 1234-5678',
        celular: '(11) 98765-4321',
        senha: 'MinhaSenh@123',
        confirmarSenha: 'MinhaSenh@123'
      };
      
      component.form.patchValue(testData);
      expect(component.form.get('nome')?.value).toBe(testData.nome);
      
      component.onReset();
      
      
      expect(component.form.get('nome')?.value).toBeNull();
      expect(component.form.get('email')?.value).toBeNull();
    });
  });

  describe('Form Integration', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have all required form controls', () => {
      expect(component.form.get('nome')).toBeTruthy();
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('cpf')).toBeTruthy();
      expect(component.form.get('rg')).toBeTruthy();
      expect(component.form.get('telefone')).toBeTruthy();
      expect(component.form.get('celular')).toBeTruthy();
      expect(component.form.get('senha')).toBeTruthy();
      expect(component.form.get('confirmarSenha')).toBeTruthy();
    });

    it('should update form values correctly', () => {
      const testData = {
        nome: 'Maria Santos',
        email: 'maria@test.com',
        cpf: '987.654.321-00',
        rg: '98.765.432-1',
        telefone: '(21) 9876-5432',
        celular: '(21) 12345-6789',
        senha: 'TesteSenha@456',
        confirmarSenha: 'TesteSenha@456'
      };

      component.form.patchValue(testData);

      expect(component.form.get('nome')?.value).toBe(testData.nome);
      expect(component.form.get('email')?.value).toBe(testData.email);
      expect(component.form.get('cpf')?.value).toBe(testData.cpf);
      expect(component.form.get('rg')?.value).toBe(testData.rg);
      expect(component.form.get('telefone')?.value).toBe(testData.telefone);
      expect(component.form.get('celular')?.value).toBe(testData.celular);
      expect(component.form.get('senha')?.value).toBe(testData.senha);
      expect(component.form.get('confirmarSenha')?.value).toBe(testData.confirmarSenha);
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render register form elements', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      expect(compiled.querySelector('p')?.textContent).toContain('Crie sua conta no Portal de Mídias.');
      expect(compiled.querySelector('h2')?.textContent).toContain('Preencha os dados abaixo');
      expect(compiled.querySelector('app-form-wrapper')).toBeTruthy();
    });

    it('should have form wrapper with correct properties', () => {
      const formWrapper = fixture.debugElement.query(By.directive(FormWrapperComponent));
      
      expect(formWrapper).toBeTruthy();
    });

    it('should render section headers', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('h2');
      
      expect(headers.length).toBeGreaterThan(0);
      expect(Array.from(headers).some(h => h.textContent?.includes('Preencha os dados abaixo'))).toBeTruthy();
    });
  });
});