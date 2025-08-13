import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { PasswordValidators } from '../../../shared/validators';
import { UsuarioService } from '../../../core/services';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  providers: [MessageService, provideNgxMask()]
})
export class CadastroComponent {
  form: FormGroup;
  hoje = new Date();
  successMessage: string | null = null;
  errorMessage: string | null = null;

  sexos = [
    { descricao: 'Masculino', value: 'M' },
    { descricao: 'Feminino', value: 'F' },
    { descricao: 'Outro', value: 'O' },
  ];

  estadoCivil = [
    { descricao: 'Casado', value: 'Casado' },
    { descricao: 'Solteiro', value: 'Solteiro' },
    { descricao: 'União estável', value: 'União estável' },
    { descricao: 'Divorciado', value: 'Divorciado' },
    { descricao: 'Viúvo', value: 'Viúvo' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly messageService: MessageService,
    private readonly usuarioService: UsuarioService
  ) {
    const passwordValidators = [
      Validators.required,
      Validators.minLength(6),
      PasswordValidators.patternValidator(/\d/, { requiresDigit: true }),
      PasswordValidators.patternValidator(/[A-Z]/, { requiresUppercase: true }),
      PasswordValidators.patternValidator(/[a-z]/, { requiresLowercase: true }),
      PasswordValidators.patternValidator(/[$@^!%*?&]/, { requiresSpecialChars: true }),
    ];

    this.form = this.fb.group({
      nome: ['', Validators.required],
      dataNascimento: [null],
      rg: ['', Validators.required],
      telefone: [''],
      celular: [''],
      sexo: [null],
      cpf: ['', [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      unidade: [null, Validators.required],
      descricao: [''],
      cargo: [null, Validators.required],
      senha: ['', [passwordValidators]],
      confirmarSenha: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const senha = group.get('senha')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    return senha === confirmar ? null : { passwordMismatch: true };
  };

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isPasswordRuleValid(rule: string): boolean {
    const control = this.form.get('senha');
    return !!(control && !control.hasError(rule));
  }

  get showPasswordValidation(): boolean {
    const control = this.form.get('senha');
    return !!(control && (control.dirty || control.touched));
  }

  get isMinLengthValid(): boolean {
    return this.isPasswordRuleValid('minlength');
  }

  get isRequiresDigitValid(): boolean {
    return this.isPasswordRuleValid('requiresDigit');
  }

  get isRequiresUppercaseValid(): boolean {
    return this.isPasswordRuleValid('requiresUppercase');
  }

  get isRequiresLowercaseValid(): boolean {
    return this.isPasswordRuleValid('requiresLowercase');
  }

  get isRequiresSpecialCharsValid(): boolean {
    return this.isPasswordRuleValid('requiresSpecialChars');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.successMessage = null;
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      this.form.markAllAsTouched();
      return;
    }

    this.successMessage = 'Cadastro realizado com sucesso!';
    this.errorMessage = null;

    const formData = this.form.getRawValue();
    delete formData.confirmarSenha;

    const objetoParaApi = {
      ...formData,
      sexo: formData.sexo ? formData.sexo.value : null,
      unidade: formData.unidade ? formData.unidade.value : null,
      cargo: formData.cargo ? formData.cargo.value : null,
    };

    //Complementar
    this.usuarioService.insert(objetoParaApi)
  }

  back(_?: any) {
    this.router.navigate(['/auth/login']);
  }
}