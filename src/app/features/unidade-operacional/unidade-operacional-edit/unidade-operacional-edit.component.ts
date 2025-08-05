import {
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Toast } from 'primeng/toast';
import { Panel } from 'primeng/panel';
import { Observable, Subscription, of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { SharedModule } from '../../../shared/shared.module';
import { UnidadeOperacionalFormComponent } from '../shared/unidade-operacional-form/unidade-operacional-form.component';
import { ErrorResponseHttp, ResponseSuccessHttp, Uf, UnidadeOperacional } from '../../../shared/models';
import { MunicipioService, UfService, UnidadeOperacionalApiService } from '../../../core/services';
import { FormUtils } from '../../../shared/utils';
import { Prepare } from '../../../shared/utils/unidade-operacional.util';


@Component({
  selector: 'app-unidade-operacional-edit',
  standalone: true,
  imports: [
    Panel,
    SharedModule,
    UnidadeOperacionalFormComponent,
    CommonModule,
    Toast
  ],
  templateUrl: './unidade-operacional-edit.component.html',
  styleUrl: './unidade-operacional-edit.component.scss'
})

export class UnidadeOperacionalEditComponent implements OnDestroy {
  @ViewChild('unidadeOperacionalForm', { static: true })
  unidadeOperacionalForm!: UnidadeOperacionalFormComponent;
  idUnidadeOperacional: string | null;
  model!: UnidadeOperacional;
  model$!: Observable<UnidadeOperacional>;
  ufs$: Observable<Uf[]>;

  breadcrumb: any[] = [
    { label: 'Unidade Operacional', route: '/unidade-operacional' },
    { label: 'Editar', route: '/edit' },
  ];

  private subscription: Subscription;

  constructor(
    public municipioService: MunicipioService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly unidadeOperacionalService: UnidadeOperacionalApiService,
    private readonly ufService: UfService,
    private readonly messageService: MessageService
  ) {
    this.idUnidadeOperacional = this.activatedRoute.snapshot.paramMap.get('id');

    this.ufs$ = ufService.getAll();

    this.subscription = this.activatedRoute.data.subscribe((response: any) => {
      if (response && response.model) {
        this.model = response.model;
        this.model$ = of(this.model);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  salvar(): void {
    if (!FormUtils.validate(this.unidadeOperacionalForm.form)) {
      return;
    }
    const prepared = new Prepare(this.unidadeOperacionalForm.form).toUnidadeOperacional();

    this.subscription = this.unidadeOperacionalService
      .update(prepared)
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

