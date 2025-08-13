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
  token: string = '';
  codigo: string = '';

  mailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  cooldown: boolean = false;
  cooldownTime = 120;
  private intervalId: any;
  private loginSubscription: Subscription | undefined;

  codigoForm = new FormGroup({
    codigo: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.mensagemLogin = this.authService.getMensagemLogin();
    const appToken = this.authService.getAppToken();
    this.token = appToken ?? '';
    this.startCooldown();
    if (this.authService.isAuthenticatedUser()) {
      if (this.authService.isAuthenticatedToken()) {
        this.router.navigate(['/auth/validar-token']);
      }
    } else {
      this.router.navigate(['/']);
    }

    this.loginSubscription = this.sharedService.login$.subscribe(() => {
      this.errorMessage = '';
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  onSubmitCodigo() {
    if (this.codigoForm.invalid) return;

    this.resetMessages();
    this.sendingRequest = true;

    const { codigo } = this.codigoForm.value;
    const body = {
      codigo: codigo?.trim() ?? '',
      token: this.token,
    };

    this.tokenService.validateToken(body).subscribe({
      next: (response) => {
        const { ativado, mensagem, perfil, token } = response;
        this.successMessage = response.mensagem;
        if (ativado) {
          this.authService.setAppToken(token);
          this.authService.setPermissaoPerfil(perfil);

          this.successMessage = mensagem;
          this.router.navigate(['/home']);
          return;
        }

        this.errorMessage = 'Token inválido ou não ativado.';
        this.sendingRequest = false; 
      },
      error: () => {
        this.errorMessage = 'Erro ao validar o token. Solicite um novo para continuar.';
        this.sendingRequest = false; 
      },
    });
  }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
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
    this.codigoForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
    this.step = 0;
  }

  onCodeChanged(code: string) {
    this.codigoForm.setValue({ codigo: code });
  }

  onCodeCompleted(code: string) { }

  reset() {
    this.router.navigate(['/auth/login']);
  }
}