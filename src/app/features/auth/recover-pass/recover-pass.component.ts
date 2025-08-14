import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CodeInputModule } from 'angular-code-input';
import { AuthService, SharedService, RecuperarSenhaService } from '../../../core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-recover-pass',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CodeInputModule,
    NgxMaskDirective
  ],
  templateUrl: './recover-pass.component.html',
  styleUrl: './recover-pass.component.scss'
})
export class RecoverPassComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  successMessage: string = '';
  sendingRequest: boolean = false;
  token: string = '';
  canResend: boolean = true;
  cooldownTime: number = 60;
  timerConfig: any;
  private readonly COOLDOWN_KEY = 'recoverPassCooldown';
  private readonly subscription: Subscription = new Subscription();


  cpfForm = new FormGroup({
    cpf: new FormControl('', [
      Validators.required, Validators.pattern('[0-9 ]*'),
    ]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly recuperarSenha : RecuperarSenhaService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const queryParamsSub = this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['c'];
    });
    this.checkCooldownState();
    this.subscription.add(queryParamsSub);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.cpfForm.invalid || !this.canResend) {
      return;
    }

    this.sendingRequest = true;
    this.errorMessage = '';
    this.successMessage = '';
    const cpf = this.cpfForm.value.cpf || '';

    const sub = this.recuperarSenha.solicitarRecuperacaoSenha(cpf).subscribe({
      next: (response) => {
        this.successMessage = response.mensagem;
        this.sendingRequest = false;
        this.startCooldownTimer();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Ocorreu uma falha. Tente novamente mais tarde.';
        this.sendingRequest = false;
      }
    });
    this.subscription.add(sub);
  }

  private checkCooldownState(): void {
    const cooldownEnd = localStorage.getItem(this.COOLDOWN_KEY);
    if (cooldownEnd) {
      const remainingTime = Math.ceil((parseInt(cooldownEnd, 10) - Date.now()) / 1000);

      if (remainingTime > 0) {
        this.canResend = false;
        this.iniciarTemporizador(remainingTime);
      } else {
        localStorage.removeItem(this.COOLDOWN_KEY);
        this.canResend = true;
      }
    }
  }

  private startCooldownTimer(): void {
    this.canResend = false;
    const cooldownEndTime = Date.now() + this.cooldownTime * 1000;
    localStorage.setItem(this.COOLDOWN_KEY, cooldownEndTime.toString());
    this.iniciarTemporizador(this.cooldownTime);
  }

  iniciarTemporizador(tempoRestante: number) {
    this.timerConfig = {
      leftTime: tempoRestante,
      format: 'mm:ss',
    };
  }

  handleEvent(event: any) {
    if (event.action === 'done') {
      this.successMessage = '';
      this.errorMessage = '';
      this.canResend = true;
      localStorage.removeItem(this.COOLDOWN_KEY);
    }
  }

  back(_?: any) {
    this.router.navigate(['/auth/login']);
  }
}