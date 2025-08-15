import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { ToastModule } from 'primeng/toast';
import { Panel } from 'primeng/panel';
import { MessageService } from 'primeng/api';

import { SharedModule } from '../../../shared/shared.module';
import { UnidadeOperacionalFormComponent } from '../shared/unidade-operacional-form/unidade-operacional-form.component';
import { ErrorResponseHttp, ResponseSuccessHttp, Uf, UnidadeOperacional } from '../../../shared/models';
import { EnderecoService, UnidadeOperacionalService } from '../../../core/services';
import { FormUtils } from '../../../shared/utils';

@Component({
  selector: 'app-unidade-operacional-edit',
  standalone: true,
  imports: [
    Panel,
    SharedModule,
    UnidadeOperacionalFormComponent,
    CommonModule,
    ToastModule
  ],
  templateUrl: './unidade-operacional-edit.component.html',
  styleUrls: ['./unidade-operacional-edit.component.scss']
})
export class UnidadeOperacionalEditComponent implements OnDestroy {
  @ViewChild('unidadeOperacionalForm', { static: true })
  unidadeOperacionalForm!: UnidadeOperacionalFormComponent;

  idUnidadeOperacional: string | null;
  model$!: Observable<any>;
  ufs$: Observable<Uf[]>;

  private ufs: Uf[] = [];

  breadcrumb: { label: string; route: string }[] = [
    { label: 'Unidade Operacional', route: '/unidade-operacional' },
    { label: 'Editar', route: '/edit' },
  ];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly unidadeOperacionalService: UnidadeOperacionalService,
    private readonly enderecoService: EnderecoService,
    private readonly messageService: MessageService
  ) {
    this.idUnidadeOperacional = this.activatedRoute.snapshot.paramMap.get('id');

    this.ufs$ = this.enderecoService.getUFs().pipe(
      tap(listaDeUfs => this.ufs = listaDeUfs)
    );

    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        const model = response?.model ?? null;
        this.model$ = of(model);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  gerandoPayload() {
    if (!FormUtils.validate(this.unidadeOperacionalForm.form)) return;

    const formValue = this.unidadeOperacionalForm.form.getRawValue();

    const ufSigla = this.unidadeOperacionalForm.form.get('uf')?.value;;

    const ufCompleto = this.ufs.find(u => u.sigla === ufSigla);
    const payload = {
      id: Number(this.idUnidadeOperacional),
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
        estadoCodigoIbge: ufCompleto?.codigoIbge || '',
        erro: false,
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
      .update(payload)
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