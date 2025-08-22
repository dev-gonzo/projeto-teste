import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { provideNgxMask } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';

import { AuthApiService } from '@app/api/auth/auth.api.service';
import { AuthService } from '@app/auth/service/auth.service';
import { FormValidatorService } from '@app/core/services/form-validation/form-validator.service';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { FormWrapperComponent } from '@app/shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';

import { LoginPage } from './login.page';
import { loginSchema } from './login.schema';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockAuthApi: jasmine.SpyObj<AuthApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockFormValidator: jasmine.SpyObj<FormValidatorService>;
  let _mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const authApiSpy = jasmine.createSpyObj('AuthApiService', ['login']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['setToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'danger']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const formValidatorSpy = jasmine.createSpyObj('FormValidatorService', ['validateForm']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    const activatedRouteSpy = {
      snapshot: { params: {}, queryParams: {} },
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoginPage,
        FormWrapperComponent,
        InputComponent
      ],
      providers: [
        { provide: AuthApiService, useValue: authApiSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: FormValidatorService, useValue: formValidatorSpy },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        provideNgxMask()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    mockAuthApi = TestBed.inject(AuthApiService) as jasmine.SpyObj<AuthApiService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockToastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    mockFormValidator = TestBed.inject(FormValidatorService) as jasmine.SpyObj<FormValidatorService>;
    _mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with login schema', () => {
      component.ngOnInit();

      expect(component.form).toBeDefined();
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });


  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });



    it('should submit successfully and navigate to home on valid form', async () => {
      const mockToken = 'mock-jwt-token';
      const formData = { email: 'test@example.com', password: 'password123' };
      
      component.form.patchValue(formData);
      mockFormValidator.validateForm.and.returnValue(Promise.resolve({ success: true }));
      mockAuthApi.login.and.returnValue(of({ token: mockToken }));

      await component.onSubmit();

      expect(mockFormValidator.validateForm).toHaveBeenCalledWith(component.form, loginSchema);
      expect(mockAuthApi.login).toHaveBeenCalledWith(formData);
      expect(mockAuthService.setToken).toHaveBeenCalledWith(mockToken);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
      expect(mockToastrService.success).toHaveBeenCalledWith('Login efetuado!');
    });

    it('should show error toast when login API fails', async () => {
      const formData = { email: 'test@example.com', password: 'wrongpassword' };
      
      component.form.patchValue(formData);
      mockFormValidator.validateForm.and.returnValue(Promise.resolve({ success: true }));
      mockAuthApi.login.and.returnValue(throwError(() => new Error('Login failed')));

      await component.onSubmit();

      expect(mockAuthApi.login).toHaveBeenCalledWith(formData);
      expect(mockToastrService.error).toHaveBeenCalledWith('E-mail ou senha inválidos');
      expect(mockAuthService.setToken).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    
  });

  describe('Form Integration', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have email and password controls', () => {
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });

    it('should update form values correctly', () => {
      const testData = {
        email: 'user@test.com',
        password: 'testpassword'
      };

      component.form.patchValue(testData);

      expect(component.form.get('email')?.value).toBe(testData.email);
      expect(component.form.get('password')?.value).toBe(testData.password);
    });
  });

  
});