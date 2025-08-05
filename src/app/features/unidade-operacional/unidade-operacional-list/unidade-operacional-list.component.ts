import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { Panel } from 'primeng/panel';
import { Toast } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { pickBy, identity } from 'lodash-es';
import { Subscription } from 'rxjs';

import { SharedModule } from '../../../shared/shared.module';


import {
  UnidadeOperacional,
  ErrorResponseHttp,
  Page,
  PageImpl,
  Pageable,
  ResponseSuccessHttp,
} from '../../../shared/models';
import { UnidadeOperacionalFilterComponent } from '../shared/unidade-operacional-filter/unidade-operacional-filter.component';
import { UnidadeOperacionalTableComponent } from '../shared/unidade-operacional-table/unidade-operacional-table.component';
import { UnidadeOperacionalApiService } from '../../../core/services';

@Component({
  selector: 'app-unidade-operacional-list',
  standalone: true,
  imports: [
    SharedModule,
    ButtonModule,
    Tooltip,
    FontAwesomeModule,
    Toast,
    Dialog,
    UnidadeOperacionalFilterComponent,
    UnidadeOperacionalTableComponent
  ],
  templateUrl: './unidade-operacional-list.component.html',
  styleUrl: './unidade-operacional-list.component.scss',
  providers: [MessageService]
})

export class UnidadeOperacionalListComponent implements OnDestroy, OnInit {
  @ViewChild('filterForm', { static: false })
  filterForm!: UnidadeOperacionalFilterComponent;

  breadcrumb: any[] = [{ label: 'Unidade Operacional', route: '/unidades-operacionais' }];
  dataSource: Page<UnidadeOperacional> = PageImpl.of([], 0);
  confirmRemoveVisible = false;
  idRemove: number | undefined;
  row!: UnidadeOperacional;

  private subscription!: Subscription;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly unidadeOperacionalService: UnidadeOperacionalApiService,
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.search();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reset(): void {
    this.filterForm.form.reset();
    this.dataSource = PageImpl.of([], 0);
    this.router.navigate([], {});
    this.search();
  }

  search(pageable?: Pageable): void {
    const httpParams = new HttpParams({
      fromObject: {
        ...this.searchParams,
        page: pageable ? pageable.pageNumber : '0',
        size: pageable ? pageable.pageSize : '5',
      },
    });

    this.subscription = this.unidadeOperacionalService
      .query(httpParams)
      .subscribe((value) => {
        this.dataSource = value;
      });
  }

  add(): void {
    this.router.navigate(['../create'], { relativeTo: this.activatedRoute });
  }

  editar(unidadeOperacional: UnidadeOperacional): void {
    this.router.navigate(['../edit/', unidadeOperacional.id], { relativeTo: this.activatedRoute });
  }

  remover(unidadeOperacional: UnidadeOperacional): void {
    this.confirmRemoveVisible = true;
    this.idRemove = unidadeOperacional.id;
  }

  confirmRemove(): void {
    this.subscription = this.unidadeOperacionalService.delete(this.idRemove).subscribe({
      next: (response: ResponseSuccessHttp) => {
        this.messageService.add({
          severity: 'success',
          summary: '',
          detail: response.mensagem,
        });
        this.search();
        this.confirmRemoveVisible = false;
        this.idRemove = undefined;
      },
      error: (error: ErrorResponseHttp) => {
        this.messageService.add({
          severity: 'error',
          summary: '',
          detail: error.erro,
        });
        this.confirmRemoveVisible = false;
        this.idRemove = undefined;
      },
    });
  }

  cancelRemove(): void {
    this.confirmRemoveVisible = false;
    this.idRemove = undefined;
  }

  addXlsx(): void {
    this.router.navigate(['../create-xlsx'], { relativeTo: this.activatedRoute });
  }

  onHistorico(): void {
    this.router.navigate(['../historico-acoes', this.row.id], { relativeTo: this.activatedRoute });
  }

  onPageChanged(pageable: { first: number; rows: number }): void {
    const pageNumber = pageable.first / pageable.rows + 1;
    this.search(new Pageable(pageNumber - 1, pageable.rows));
  }

  get searchParams(): { [param: string]: string } {
    const searchParams = this.filterForm ? this.filterForm.form.value : {};
    return pickBy(searchParams, identity);
  }
}