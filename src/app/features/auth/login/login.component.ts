import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskDirective } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { AuthService, SharedService } from '../../../core/services';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxMaskDirective,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginSuccessRes: any = null;
  successMessage: string = '';
  errorMessage: string = '';
  sendingRequest: boolean = false;

  private loginEventSubscription!: Subscription;

  credentialsForm = new FormGroup({
    cpf: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9 ]*'),
    ]),
    senha: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loginEventSubscription = this.sharedService.login$.subscribe(() => {
      this.errorMessage = '';
      this.successMessage = '';
      this.sendingRequest = false;
    });
  }

  loginError(error: any): void {
    this.errorMessage = error?.error?.message || 'Dados de login incorretos. Tente novamente.';
    this.sendingRequest = false;
  }

  loginSuccess(response: any): void {
    if (response.success) {
      this.successMessage = 'Login realizado com sucesso!';
    } else {
      this.errorMessage = response.message;
    }
    this.sendingRequest = false;
    this.credentialsForm.reset({ cpf: this.credentialsForm.value.cpf });
  }

  onSubmit(): void {
    if (!this.credentialsForm.valid) {
      return;
    }
    this.errorMessage = '';
    const credentials = {
      cpf: this.credentialsForm.value.cpf!,
      senha: this.credentialsForm.value.senha!,
    };
    this.sendingRequest = true;
    this.authService.login(credentials).subscribe({
      next: this.loginSuccess.bind(this),
      error: (err) => {
        this.loginError(err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loginEventSubscription) {
      this.loginEventSubscription.unsubscribe();
    }
  }
}
