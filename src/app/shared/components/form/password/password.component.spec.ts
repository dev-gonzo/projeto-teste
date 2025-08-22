import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { PasswordComponent } from './password.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  standalone: true,
  imports: [PasswordComponent, ReactiveFormsModule],
  template: `
    <app-form-password 
      [passwordControl]="passwordControl" 
      [confirmPasswordControl]="confirmPasswordControl"
      [passwordLabel]="passwordLabel"
      [confirmPasswordLabel]="confirmPasswordLabel"
      [passwordPlaceholder]="passwordPlaceholder"
      [confirmPasswordPlaceholder]="confirmPasswordPlaceholder"
      [passwordId]="passwordId"
      [confirmPasswordId]="confirmPasswordId">
    </app-form-password>
  `
})
class TestHostComponent {
  passwordControl = new FormControl<string | null>('');
  confirmPasswordControl = new FormControl<string | null>('');
  passwordLabel = 'Senha';
  confirmPasswordLabel = 'Confirmar Senha';
  passwordPlaceholder = 'Digite sua senha';
  confirmPasswordPlaceholder = 'Confirme sua senha';
  passwordId = 'test-password';
  confirmPasswordId = 'test-confirm-password';
}

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordComponent, ReactiveFormsModule, WrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    
    
    component.passwordControl = new FormControl<string | null>('');
    component.confirmPasswordControl = new FormControl<string | null>('');
    
    fixture.detectChanges();
  });

  beforeEach(async () => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default property values', () => {
      expect(component.passwordLabel).toBe('Senha');
      expect(component.confirmPasswordLabel).toBe('Confirmar Senha');
      expect(component.passwordPlaceholder).toBe('Digite sua senha');
      expect(component.confirmPasswordPlaceholder).toBe('Confirme sua senha');

      expect(component.showCriteria).toBe(false);
    });

    it('should accept custom labels and placeholders', () => {
      component.passwordLabel = 'Nova Senha';
      component.confirmPasswordLabel = 'Repetir Senha';
      component.passwordPlaceholder = 'Insira nova senha';
      component.confirmPasswordPlaceholder = 'Repita a senha';
      
      expect(component.passwordLabel).toBe('Nova Senha');
      expect(component.confirmPasswordLabel).toBe('Repetir Senha');
      expect(component.passwordPlaceholder).toBe('Insira nova senha');
      expect(component.confirmPasswordPlaceholder).toBe('Repita a senha');
    });
  });

  describe('Input ID Generation', () => {
    it('should generate passwordInputId from label when id not provided', () => {
      component.passwordLabel = 'Nova Senha';
      expect(component.passwordInputId).toBe('password-nova-senha');
    });

    it('should use custom passwordId when provided', () => {
      component.passwordId = 'custom-password-id';
      expect(component.passwordInputId).toBe('custom-password-id');
    });

    it('should generate confirmPasswordInputId from label when id not provided', () => {
      component.confirmPasswordLabel = 'Repetir Senha';
      expect(component.confirmPasswordInputId).toBe('confirm-password-repetir-senha');
    });

    it('should use custom confirmPasswordId when provided', () => {
      component.confirmPasswordId = 'custom-confirm-id';
      expect(component.confirmPasswordInputId).toBe('custom-confirm-id');
    });
  });

  describe('Error Handling', () => {
    it('should return null for passwordError when control is not touched', () => {
      component.passwordControl.setErrors({ message: 'Error' });
      expect(component.passwordError).toBeNull();
    });

    it('should return error message when control is touched and has errors', () => {
      component.passwordControl.setErrors({ message: 'Password required' });
      component.passwordControl.markAsTouched();
      expect(component.passwordError).toBe('Password required');
    });

    it('should return null for confirmPasswordError when control is not touched', () => {
      component.confirmPasswordControl.setErrors({ message: 'Error' });
      expect(component.confirmPasswordError).toBeNull();
    });

    it('should return error message when confirmPasswordControl is touched and has errors', () => {
      component.confirmPasswordControl.setErrors({ message: 'Passwords do not match' });
      component.confirmPasswordControl.markAsTouched();
      expect(component.confirmPasswordError).toBe('Passwords do not match');
    });
  });

  describe('Password Criteria Validation', () => {
    it('should validate minimum length requirement', () => {
      component.passwordControl.setValue('1234567');
      expect(component.passwordCriteria.hasMinLength).toBe(false);
      
      component.passwordControl.setValue('12345678');
      expect(component.passwordCriteria.hasMinLength).toBe(true);
    });

    it('should validate uppercase requirement', () => {
      component.passwordControl.setValue('password');
      expect(component.passwordCriteria.hasUppercase).toBe(false);
      
      component.passwordControl.setValue('Password');
      expect(component.passwordCriteria.hasUppercase).toBe(true);
    });

    it('should validate lowercase requirement', () => {
      component.passwordControl.setValue('PASSWORD');
      expect(component.passwordCriteria.hasLowercase).toBe(false);
      
      component.passwordControl.setValue('Password');
      expect(component.passwordCriteria.hasLowercase).toBe(true);
    });

    it('should validate number requirement', () => {
      component.passwordControl.setValue('Password');
      expect(component.passwordCriteria.hasNumber).toBe(false);
      
      component.passwordControl.setValue('Password1');
      expect(component.passwordCriteria.hasNumber).toBe(true);
    });

    it('should validate special character requirement', () => {
      component.passwordControl.setValue('Password1');
      expect(component.passwordCriteria.hasSpecialChar).toBe(false);
      
      component.passwordControl.setValue('Password1!');
      expect(component.passwordCriteria.hasSpecialChar).toBe(true);
    });
  });

  describe('Password Strength Classification', () => {
    it('should classify weak password (score <= 2)', () => {
      component.passwordControl.setValue('pass');
      const strength = component.passwordStrength;
      expect(strength.label).toBe('fraca');
      expect(strength.class).toBe('danger');
      expect(strength.score).toBeLessThanOrEqual(2);
    });

    it('should classify medium password (score 3-4)', () => {
      component.passwordControl.setValue('Password1');
      const strength = component.passwordStrength;
      expect(strength.label).toBe('média');
      expect(strength.class).toBe('warning');
      expect(strength.score).toBeGreaterThan(2);
      expect(strength.score).toBeLessThanOrEqual(4);
    });

    it('should classify strong password (score 5)', () => {
      component.passwordControl.setValue('Password1!');
      const strength = component.passwordStrength;
      expect(strength.label).toBe('forte');
      expect(strength.class).toBe('success');
      expect(strength.score).toBe(5);
    });
  });

  describe('Password Validation', () => {
    it('should return false for isPasswordValid when criteria not met', () => {
      component.passwordControl.setValue('weak');
      expect(component.isPasswordValid).toBe(false);
    });

    it('should return true for isPasswordValid when all criteria met', () => {
      component.passwordControl.setValue('StrongPass1!');
      expect(component.isPasswordValid).toBe(true);
    });
  });

  describe('Password Strength with Prefix', () => {
    it('should return "Senha fraca" for weak passwords', () => {
      component.passwordControl.setValue('123');
      expect(component.passwordStrengthWithPrefix).toBe('Senha fraca');
    });

    it('should return "Senha média" for medium passwords', () => {
      component.passwordControl.setValue('Test123');
      expect(component.passwordStrengthWithPrefix).toBe('Senha média');
    });

    it('should return "Senha forte" for strong passwords', () => {
      component.passwordControl.setValue('StrongPass1!');
      expect(component.passwordStrengthWithPrefix).toBe('Senha forte');
    });
  });

  describe('Focus and Blur Handlers', () => {
    it('should show criteria on password focus', () => {
      expect(component.showCriteria).toBe(false);
      
      component.onPasswordFocus();
      expect(component.showCriteria).toBe(true);
    });

    it('should hide criteria on password blur when password is valid', () => {
      component.passwordControl.setValue('StrongPass1!');
      component.showCriteria = true;
      
      component.onPasswordBlur();
      expect(component.showCriteria).toBe(false);
    });

    it('should keep criteria visible on password blur when password is invalid', () => {
      component.passwordControl.setValue('weak');
      component.showCriteria = true;
      
      component.onPasswordBlur();
      expect(component.showCriteria).toBe(true);
    });

    it('should update criteria visibility on password input', () => {
      component.passwordControl.setValue('weak');
      component.onPasswordInput();
      expect(component.showCriteria).toBe(true);
      
      component.passwordControl.setValue('StrongPass1!');
      component.onPasswordInput();
      expect(component.showCriteria).toBe(false);
    });
  });

  describe('Template Integration', () => {
    it('should render password wrapper with correct inputs', () => {
      const wrapperElements = fixture.debugElement.queryAll(By.directive(WrapperComponent));
      expect(wrapperElements.length).toBe(2);
      
      const passwordWrapper = wrapperElements[0].componentInstance;
      expect(passwordWrapper.label).toBe('Senha');
      expect(passwordWrapper.inputId).toBe(component.passwordInputId);
    });

    it('should render confirm password wrapper with correct inputs', () => {
      const wrapperElements = fixture.debugElement.queryAll(By.directive(WrapperComponent));
      const confirmWrapper = wrapperElements[1].componentInstance;
      
      expect(confirmWrapper.label).toBe('Confirmar Senha');
      expect(confirmWrapper.inputId).toBe(component.confirmPasswordInputId);
    });

    it('should render password input with correct attributes', () => {
      const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
      
      expect(passwordInput.nativeElement.id).toBe(component.passwordInputId);
      expect(passwordInput.nativeElement.placeholder).toBe('Digite sua senha');
    });



    it('should show password criteria when showCriteria is true', () => {
      component.passwordControl.setValue('test');
      component.showCriteria = true;
      fixture.detectChanges();
      
      const criteriaElement = fixture.debugElement.query(By.css('.password-criteria'));
      expect(criteriaElement).toBeTruthy();
    });

    it('should hide password criteria when showCriteria is false', () => {
      component.showCriteria = false;
      fixture.detectChanges();
      
      const criteriaElement = fixture.debugElement.query(By.css('.password-criteria'));
      expect(criteriaElement).toBeFalsy();
    });


  });

  describe('Host Component Integration', () => {
    it('should work correctly with host component', () => {
      const passwordComponent = hostFixture.debugElement.query(By.directive(PasswordComponent));
      expect(passwordComponent).toBeTruthy();
      
      const componentInstance = passwordComponent.componentInstance;
      expect(componentInstance.passwordLabel).toBe('Senha');
      expect(componentInstance.confirmPasswordLabel).toBe('Confirmar Senha');
    });

    it('should update when host component properties change', () => {
      hostComponent.passwordLabel = 'Nova Senha';
      hostFixture.detectChanges();
      
      const passwordComponent = hostFixture.debugElement.query(By.directive(PasswordComponent));
      expect(passwordComponent.componentInstance.passwordLabel).toBe('Nova Senha');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null password control gracefully', () => {
      component.passwordControl = null as unknown as FormControl;
      expect(() => {
        const error = component.passwordError;
        expect(error).toBeNull();
      }).not.toThrow();
    });

    it('should handle undefined password control gracefully', () => {
      component.passwordControl = undefined as unknown as FormControl;
      expect(() => {
        const error = component.passwordError;
        expect(error).toBeNull();
      }).not.toThrow();
    });

    it('should handle empty password value', () => {
      component.passwordControl.setValue('');
      expect(component.passwordValue).toBe('');
      expect(component.isPasswordValid).toBe(false);
    });

    it('should handle null password value', () => {
      component.passwordControl.setValue(null);
      expect(component.passwordValue).toBe('');
    });
  });
});