import { CalendarModule } from 'primeng/calendar';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    RouterLink
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
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

  ufs = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
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
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      rua: [{ value: '', disabled: true }, Validators.required],
      bairro: [{ value: '', disabled: true }, Validators.required],
      uf: [{ value: null, disabled: true }, Validators.required],
      numero: ['', Validators.required],
      complemento: [''],

      descricao: [''],

      cargo: [null, Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
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



  onSubmit() {
    if (this.form.valid) {
      this.successMessage = 'Cadastro realizado com sucesso!';
      this.errorMessage = null;

      console.log('Form enviado:', this.form.value);
    } else {
      this.successMessage = null;
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      this.form.markAllAsTouched();

      console.log('Form inválido');
    }
  }
}
