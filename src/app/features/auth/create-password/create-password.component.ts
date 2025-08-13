import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PasswordValidators } from '../../../shared/validators';
import { RecuperarSenhaService } from '../../../core/services';
import { Subscription } from 'rxjs';

const passwordValidators = [
  Validators.required,
  Validators.minLength(6),
  PasswordValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
    requiresDigit: true,
  }),
  PasswordValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
    requiresUppercase: true,
  }),
  PasswordValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
    requiresLowercase: true,
  }),
  PasswordValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
    requiresSpecialChars: true,
  }),
];

@Component({
  selector: 'create-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.scss',
})
export class CreatePasswordComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  errorMessageMatch: string = '';
  successMessage: string = '';
  sendingRequest: boolean = false;
  token: string = '';
  showPass: boolean = false;

  private readonly subscriptions = new Subscription();

  passForm = new FormGroup(
    {
      password: new FormControl('', Validators.compose(passwordValidators)),
      password_confirm: new FormControl('', Validators.compose(passwordValidators)),
    },
    {
      validators: PasswordValidators.MatchValidator,
    }
  );

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly recuperarSenhar: RecuperarSenhaService
  ) { }

  ngOnInit(): void {
    const queryParamsSub = this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['c'];
      this.verifyParams();
    });

    const formChangesSub = this.passForm.valueChanges.subscribe(() => {
      const control = this.passForm.get('password_confirm');
      if (control?.hasError('mismatch') && (control.dirty || control.touched)) {
        this.errorMessageMatch = 'As senhas são diferentes.';
      } else {
        this.errorMessageMatch = '';
      }
    });
    this.subscriptions.add(queryParamsSub);
    this.subscriptions.add(formChangesSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  verifyParams() {
    if (!this.token) {
      this.router.navigate(['/auth/login']);
    }
  }

  onSubmit() {
    if (this.passForm.invalid) {
      return;
    }

    const token = this.token;
    const password = this.passForm.value.password || '';
    this.sendingRequest = true;

    const createPassSub = this.recuperarSenhar.validarRecuperacaoSenha(token, password )
      .subscribe({
        next: (response) => {
          this.sendingRequest = false;
          this.successMessage = response.mensagem || 'Senha cadastrada com sucesso. Você será redirecionado para a área de login.';
          setTimeout(() => this.back(), 2000);
        },
        error: (err) => {
          this.sendingRequest = false;
          this.errorMessage = err.error?.message || 'Erro ao cadastrar senha. Tente novamente ou solicite uma nova validação.';
        },
      });

    this.subscriptions.add(createPassSub);
  }

  back(): void {
    this.router.navigate(['/auth/login']);
  }

  isPasswordRuleValid(rule: string): boolean {
    const control = this.passForm.get('password');
    return control != null && !control.hasError(rule) && (control.dirty || control.touched);
  }

  get minLengthValid(): boolean {
    return this.isPasswordRuleValid('minlength');
  }

  get requiresDigitValid(): boolean {
    return this.isPasswordRuleValid('requiresDigit');
  }

  get requiresUppercaseValid(): boolean {
    return this.isPasswordRuleValid('requiresUppercase');
  }

  get requiresLowercaseValid(): boolean {
    return this.isPasswordRuleValid('requiresLowercase');
  }

  get requiresSpecialCharsValid(): boolean {
    return this.isPasswordRuleValid('requiresSpecialChars');
  }

  get requiredValid(): boolean {
    const control = this.passForm.get('password');
    return control != null && !control.hasError('required') && (control.dirty || control.touched);
  }

  get mismatchValid(): boolean {
    const control = this.passForm.get('password_confirm');
    return control != null && control.hasError('mismatch') && (control.dirty || control.touched);
  }

  get password() {
    return this.passForm.controls.password;
  }

  get password_confirm() {
    return this.passForm.controls.password_confirm;
  }
}