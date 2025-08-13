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

export function patternValidator(regex: RegExp, error: object): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const valid = regex.test(control.value);
    return valid ? null : error;
  };
}

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

  unidades = [
    { descricao: 'Unidade A', value: 'a' },
    { descricao: 'Unidade B', value: 'b' },
  ];

  cargos = [
    { descricao: 'Cargo 1', value: 'cargo1' },
    { descricao: 'Cargo 2', value: 'cargo2' },
  ];

  ufs = [
    { descricao: 'SP', value: 'SP' },
    { descricao: 'RJ', value: 'RJ' },
    { descricao: 'MG', value: 'MG' },
    { descricao: 'ES', value: 'ES' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly messageService: MessageService
  ) {
    const passwordValidators = [
      Validators.required,
      Validators.minLength(6),
      patternValidator(/\d/, { requiresDigit: true }),
      patternValidator(/[A-Z]/, { requiresUppercase: true }),
      patternValidator(/[a-z]/, { requiresLowercase: true }),
      patternValidator(/[$@^!%*?&]/, { requiresSpecialChars: true }),
    ];

    this.form = this.fb.group({
      nome: ['', Validators.required],
      dataNascimento: [null],
      rg: ['', Validators.required],
      telefone: [''],
      celular: [''],
      sexo: [null],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      unidade: [null, Validators.required],
      cep: ['', Validators.required],
      rua: [{ value: '', disabled: true }, Validators.required],
      bairro: [{ value: '', disabled: true }, Validators.required],
      uf: [{ value: null, disabled: true }, Validators.required],
      municipio: [{ value: '', disabled: true }, Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      descricao: [''],
      cargo: [null, Validators.required],
      senha: ['', passwordValidators],
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

  buscarEnderecoPorCep(): void {
    const cep = this.form.get('cep')?.value?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      return;
    }

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.messageService.add({ severity: 'warn', summary: 'CEP não encontrado' });
          return;
        }

        this.form.patchValue({
          rua: dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          municipio: dados.localidade,
          uf: dados.uf
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro ao buscar CEP' });
      }
    });
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
      uf: formData.uf ? formData.uf.value : null,
    };

    console.log('Objeto para enviar para a API:', objetoParaApi);
  }

  back(_?: any) {
    this.router.navigate(['/auth/login']);
  }
}