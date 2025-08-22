import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '@app/api/auth/auth.api.service';
import { AuthService } from '@app/auth/service/auth.service';
import { FormValidatorService } from '@app/core/services/form-validation/form-validator.service';
import { TypedFormGroup } from '@app/core/types/forms';
import { createFormFromSchema } from '@app/core/utils/createFormFromSchema';
import { FormWrapperComponent } from '@app/shared/components/form/form-wrapper/form-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { ToastrService } from 'ngx-toastr';

import { LoginFormData, loginSchema } from './login.schema'; 
import { AccessibilityControlsComponent } from '@app/shared/components/accessibility-controls/accessibility-controls.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormWrapperComponent, InputComponent, AccessibilityControlsComponent, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage implements OnInit {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly validator = inject(FormValidatorService);
  private readonly authApi = inject(AuthApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastrService);

  form!: TypedFormGroup<LoginFormData>;

  ngOnInit(): void {
    const { form } = createFormFromSchema(
      loginSchema,
      this.onSubmit.bind(this),
    );
    this.form = form;

    requestAnimationFrame(() => this.cdRef.detectChanges());
  }

  async onSubmit(): Promise<void> {
    const result = await this.validator.validateForm(this.form, loginSchema);

    if (!result.success) {
      this.form.markAllAsTouched();
      this.cdRef.detectChanges();
      return;
    }

    this.authApi.login(this.form.value as LoginFormData).subscribe({
      next: ({ token }) => {
        this.auth.setToken(token);
        this.router.navigate(['/home']);
        this.toast.success('Login efetuado!');
      },
      error: () => {
        this.toast.error('E-mail ou senha inválidos');


      },
    });
  }
}
