import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CodeInputModule } from 'angular-code-input';
import { Subscription } from 'rxjs';

import { AuthService, SharedService } from '../../../core/services';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'validate-token',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CodeInputModule,
  ],
  templateUrl: './validate-token.component.html',
  styleUrl: './validate-token.component.scss',
})
export class ValidateTokenComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  successMessage: string = '';
  step: number = 0;
  sendingRequest: boolean = false;
  mensagemLogin: string | null = '';

  mailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  cooldown: boolean = false;
  cooldownTime = 120;
  private intervalId: any;
  private loginSubscription: Subscription | undefined;

  tokenForm = new FormGroup({
    token: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly tokenService: TokenService
  ) { }

  ngOnInit(): void {
    const appToken = this.authService.getAppToken();

    this.startCooldown();
    if (appToken) {
      this.router.navigate(['/valida-token']);
      return;
    }
    if (this.authService.isAuthenticatedUser()) {
      if (this.authService.isAuthenticatedToken()) {
        this.router.navigate(['/valida-token']);
      }
    } else {
      this.router.navigate(['/']);
    }

    this.loginSubscription = this.sharedService.login$.subscribe(() => {
      this.errorMessage = '';
    });

    this.step = 0;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  onSubmitEmail() {
    if (this.mailForm.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.sendingRequest = true;

    const email = this.mailForm.value.email ?? '';
    const body = { email };

    this.tokenService.requestToken(body).subscribe({
      next: (response) => {
        this.sendingRequest = false;

        if (response.jwt) {
          this.tokenService.setToken(response.jwt);

          if (response.mensagem === 'O usuário está dentro do limite de 24hr.') {
            this.successMessage =
              'Você já solicitou um token recentemente, você será redirecionado para a página principal.';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 5000);
            return;
          } else {
            this.successMessage =
              response.mensagem ||
              'Token enviado com sucesso, verifique o seu e-mail.';
            this.errorMessage = '';
            this.step = 1;
            this.startCooldown();
          }

          this.errorMessage = '';
        } else {
          this.successMessage = '';
          this.errorMessage = 'Erro inesperado ao solicitar token.';
        }
      },
      error: (error) => {
        this.errorMessage =
          error.erro || 'E-mail não compatível com registros do sistema.';
        this.successMessage = '';
        this.sendingRequest = false;
      },
    });

  }

  onSubmitToken() {
    if (this.tokenForm.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';

    const body = {
      jwt: this.tokenService.getToken(),
      token: this.tokenForm.value.token?.trim() ?? '',
    };

    this.tokenService.validateToken(body).subscribe({
      next: (response) => {
        if (response?.sessionToken) {
          this.successMessage = 'Token validado com sucesso. Você será redirecionado...';
          this.errorMessage = '';
          setTimeout(() => {
            this.authService.setAppToken(response.sessionToken);
            this.router.navigate(['/home']);
          }, 5000);
        } else {
          this.errorMessage = 'Resposta inválida do servidor.';
        }
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'Token inválido ou expirado. Solicite um novo para continuar.';
      },
    });
  }


  startCooldown() {
    this.cooldownTime = 300;
    this.cooldown = false;

    this.intervalId = setInterval(() => {
      this.cooldownTime--;

      if (this.cooldownTime <= 0) {
        this.cooldown = true;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  get formattedCooldownTime(): string {
    const minutes = Math.floor(this.cooldownTime / 60);
    const seconds = this.cooldownTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  resetToken() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.mailForm.reset();
    this.tokenForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.step = 0;
  }

  onCodeChanged(code: string) {
    this.tokenForm.setValue({ token: code });
  }

  onCodeCompleted(code: string) { }

  reset() {
    this.router.navigate(['/auth/login']);
  }
}