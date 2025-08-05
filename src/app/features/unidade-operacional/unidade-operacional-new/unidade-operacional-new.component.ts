import {
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { Observable, Subscription } from 'rxjs';

import { SharedModule } from '../../../shared/shared.module';
import { FormUtils } from '../../../shared/utils';
import {
  UfApiService,
  MunicipioService,
  UnidadeOperacionalApiService,
  transformarTelefones,
} from '../../../core/services';
import {
  ErrorResponseHttp,
  ResponseSuccessHttp,
  Uf,
  UnidadeOperacional,
} from '../../../shared/models';
import { UnidadeOperacionalFormComponent } from '../shared/unidade-operacional-form/unidade-operacional-form.component';

@Component({
  selector: 'app-unidade-operacional-new',
  standalone: true,
  imports: [Panel, SharedModule, UnidadeOperacionalFormComponent, CommonModule, Toast],
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

  private subscription!: Subscription;

  constructor(
    public municipioService: MunicipioService,
    private readonly router: Router,
    private readonly unidadeOperacionalService: UnidadeOperacionalApiService,
    private readonly ufService: UfApiService,
    private readonly messageService: MessageService
  ) {
    this.ufs$ = ufService.getAll();
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

    this.subscription = this.unidadeOperacionalService
      .insert(this.prepare(this.unidadeOperacionalForm.form))
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

  prepare(form: FormGroup | FormArray, id?: number): UnidadeOperacional {
    let value: UnidadeOperacional = form.getRawValue();

    if (id) {
      value = { ...value, id };
    }

    return transformarTelefones(value);
  }

}
