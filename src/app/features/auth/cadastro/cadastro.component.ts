import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { PasswordValidators } from '../../../shared/validators'; 
import { UsuarioService, CargoService, UnidadeOperacionalService } from '../../../core/services';
import { Cargo, ListaUnidadeOperacional } from '../../../shared/models';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    FontAwesomeModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  providers: [
    MessageService,
    provideNgxMask(), 
    UsuarioService,
    UnidadeOperacionalService,
    CargoService
  ]
})
export class CadastroComponent implements OnInit {
  form: FormGroup;
  hoje = new Date();
  isLoading = false;
  successMessage: string = '';
  errorMessage: string = '';

  unidades: ListaUnidadeOperacional[] = [];
  cargos: Cargo[] = [];

  sexos = [
    { nome: 'Masculino', id: 'M' },
    { nome: 'Feminino', id: 'F' },
    { nome: 'Outro', id: 'O' },
  ];

  estadoCivil = [
    { nome: 'Casado(a)', id: 'Casado' },
    { nome: 'Solteiro(a)', id: 'Solteiro' },
    { nome: 'União Estável', id: 'UniaoEstavel' },
    { nome: 'Divorciado(a)', id: 'Divorciado' },
    { nome: 'Viúvo(a)', id: 'Viuvo' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
    private readonly unidadeService: UnidadeOperacionalService,
    private readonly cargoService: CargoService
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
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      email: ['', [Validators.required, Validators.email]],
      estadoCivil: [null, Validators.required],
      unidade: [null, Validators.required], 
      cargo: [null, Validators.required], 
      descricao: [''],
      senha: ['', passwordValidators],
      confirmarSenha: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.unidadeService.getAll().subscribe(data => this.unidades = data);
    this.cargoService.getAll().subscribe(data => this.cargos = data);
  }

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { passwordMismatch: true };
  };

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get showPasswordValidation(): boolean {
    const control = this.form.get('senha');
    return !!(control && (control.dirty || control.touched));
  }
  get isMinLengthValid(): boolean {
    return this.form.get('senha')?.hasError('minlength') === false;
  }

  get isRequiresDigitValid(): boolean {
    return this.form.get('senha')?.hasError('requiresDigit') === false;
  }

  get isRequiresUppercaseValid(): boolean {
    return this.form.get('senha')?.hasError('requiresUppercase') === false;
  }

  get isRequiresLowercaseValid(): boolean {
    return this.form.get('senha')?.hasError('requiresLowercase') === false;
  }

  get isRequiresSpecialCharsValid(): boolean {
    return this.form.get('senha')?.hasError('requiresSpecialChars') === false;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.form.getRawValue();

    const payload = {
      ...formData,
      sexo: formData.sexo ? formData.sexo.id : null,
      estadoCivil: formData.estadoCivil ? formData.estadoCivil.id : null,
      unidadeId: formData.unidade ? formData.unidade.id : null,
      cargoId: formData.cargo ? formData.cargo.id : null,
    };
    delete payload.unidade;
    delete payload.cargo;
    delete payload.confirmarSenha;


    this.usuarioService.insert(payload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.successMessage = response.mensagem || 'Cadastro realizado com sucesso! Redirecionando para tela de Login.';
        setTimeout(() => this.back(), 2500);
      },
      error: (err) => {
        this.errorMessage = err?.error?.mensagem || 'Ocorreu um erro ao realizar o cadastro. Tente novamente.';
      },
    });
  }

  back(_?: any) {
    this.router.navigate(['/auth/login']);
  }
}