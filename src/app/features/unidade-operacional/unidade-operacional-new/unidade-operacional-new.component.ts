import {
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SharedModule } from '../../../shared/shared.module';
import { FormUtils } from '../../../shared/utils';
import {
  EnderecoService,
  UnidadeOperacionalService,
} from '../../../core/services';
import {
  ErrorResponseHttp,
  ResponseSuccessHttp,
  Uf
} from '../../../shared/models';
import { UnidadeOperacionalFormComponent } from '../shared/unidade-operacional-form/unidade-operacional-form.component';

@Component({
  selector: 'app-unidade-operacional-new',
  standalone: true,
  imports: [Panel, SharedModule, UnidadeOperacionalFormComponent, CommonModule, ToastModule],
  templateUrl: './unidade-operacional-new.component.html',
  styleUrl: './unidade-operacional-new.component.scss',
  providers: [MessageService]
})
export class UnidadeOperacionalNewComponent implements OnDestroy {
  @ViewChild('unidadeOperacionalForm', { static: true })
  unidadeOperacionalForm!: UnidadeOperacionalFormComponent;
  ufs$: Observable<Uf[]>;

  breadcrumb: any[] = [
    { label: 'Unidade Operacional', route: '/unidade-operacional' },
    { label: 'Adicionar', route: '/create' },
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly enderecoService: EnderecoService,
    private readonly router: Router,
    private readonly unidadeOperacionalService: UnidadeOperacionalService,
    private readonly messageService: MessageService
  ) {
    this.ufs$ = enderecoService.getUFs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  gerandoPayload() {
    if (!FormUtils.validate(this.unidadeOperacionalForm.form)) return;
    const formValue = this.unidadeOperacionalForm.form.getRawValue();
    const ufSigla = this.unidadeOperacionalForm.form.get('uf')?.value;;
    const payload = {
      nomeUnidadeOperacional: formValue.nomeUnidadeOperacional,
      responsavelUnidadeOperacional: formValue.responsavelUnidadeOperacional,
      numeroTelefonePrincipal: formValue.numeroTelefonePrincipal?.replace(/\D/g, '') || null,
      numeroTelefoneSecundario: formValue.numeroTelefoneSecundario?.replace(/\D/g, '') || null,
      endereco: {
        estadoSigla: ufSigla || '',
        municipioNome: formValue.municipio?.nome || '',
        cep: formValue.cep?.replace(/\D/g, '') || '',
        logradouro: formValue.nomeLogradouro,
        numero: formValue.numeroLogradouro,
        complemento: formValue.nomeComplemento,
        bairro: formValue.nomeBairro,
        municipioCodigoIbge: formValue.municipio?.codigoIbge || '',
      }
    };

    return payload;
  }

  salvar(): void {
    const payload = this.gerandoPayload();

    if (!payload) {
      return;
    }

    this.unidadeOperacionalService
      .insert(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  cancelar(): void {
    this.router.navigate(['../unidade-operacional']);
  }
}
