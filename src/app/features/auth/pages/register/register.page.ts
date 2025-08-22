import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FormValidatorService } from '@app/core/services/form-validation/form-validator.service';
import { TypedFormGroup } from '@app/core/types/forms';
import { createFormFromSchema } from '@app/core/utils/createFormFromSchema';
import { FormWrapperComponent } from '@app/shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { PasswordComponent } from '@app/shared/components/form/password/password.component';
import { ToastrService } from 'ngx-toastr';
import { AccessibilityControlsComponent } from '@app/shared/components/accessibility-controls/accessibility-controls.component';
import { ThemeState } from '@app/design/theme/theme.state';

import { RegisterFormData, registerSchema } from './register.schema';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormWrapperComponent, InputComponent, PasswordComponent, AccessibilityControlsComponent],
  templateUrl: './register.page.html',
})
export class RegisterPage implements OnInit {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly validator = inject(FormValidatorService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastrService);
  readonly theme = inject(ThemeState);

  form!: TypedFormGroup<RegisterFormData>;

  ngOnInit(): void {
    const { form } = createFormFromSchema(
      registerSchema,
      this.onSubmit.bind(this),
    );
    this.form = form;

    requestAnimationFrame(() => this.cdRef.detectChanges());
  }

  async onSubmit(): Promise<void> {
    const result = await this.validator.validateForm(this.form, registerSchema);

    if (!result.success) {
      this.form.markAllAsTouched();
      this.cdRef.detectChanges();
      return;
    }

    try {
      
      
      
      this.toast.success('Usuário registrado com sucesso!');
      
      
      this.router.navigate(['/auth/login']);
    } catch {
      this.toast.error('Erro ao registrar usuário. Tente novamente.');
    }
  }

  onReset(): void {
    this.form.reset();
    this.cdRef.detectChanges();
  }
}