import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Panel } from 'primeng/panel';
import { Subscription } from 'rxjs';

import { UnidadeOperacionalApiService } from '../../../../core/services';
import { SharedModule } from '../../../../shared/shared.module';
import {
  ErrorResponseHttp,
  LogUpload,
  ResponseSuccessHttp,
} from '../../../../shared/models';

@Component({
  selector: 'app-unidade-operacional-upload',
  standalone: true,
  imports: [ToastModule, CommonModule, SharedModule, Panel],
  templateUrl: './unidade-operacional-upload.component.html',
  styleUrl: './unidade-operacional-upload.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})

export class UnidadeOperacionalUploadComponent implements OnDestroy {
  titleHeader = 'Seleção de XLSX para cadastrar as unidades operacionais';

  log!: LogUpload;

  breadcrumb: any[] = [
    { label: 'Unidade Operacional', route: '/unidade-operacional' },
    { label: 'Enviar XLSX ', route: '/create' },
  ];

  private subscription!: Subscription;

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
    public unidadeOperacionalService: UnidadeOperacionalApiService
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cancelar(): void {
    this.router.navigate(['../unidade-operacional']);
  }

  onLogs(log: HttpResponse<any>): void {
    this.log = log.body;
    this.titleHeader = 'Análise de dados recebidos';
    this.cdr.detectChanges();
  }

  finalizar(): void {
    this.subscription = this.unidadeOperacionalService.finalizarUpload().subscribe({
      next: (response: ResponseSuccessHttp) => {
        this.messageService.add({
          severity: 'success',
          summary: '',
          detail: response.mensagem,
        });
        this.cancelar();
      },
      error: (error: ErrorResponseHttp) => {
        this.messageService.add({
          severity: 'error',
          summary: '',
          detail: error.erro,
        });
      },
    });
  }
}
