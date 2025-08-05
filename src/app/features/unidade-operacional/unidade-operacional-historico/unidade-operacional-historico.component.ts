import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UnidadeOperacionalHistoricoFilterComponent } from '../shared/unidade-operacional-historico-filter/unidade-operacional-historico-filter.component';
import { HistoricoAcoes, Page, Pageable, PageImpl } from '../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadeOperacionalService } from '../../../core/services';
import { HttpParams } from '@angular/common/http';
import { identity, pickBy } from 'lodash-es';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UnidadeOperacionalHistoricoTableComponent } from '../shared/unidade-operacional-historico-table/unidade-operacional-historico-table.component';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unidade-operacional-historico',
  standalone: true,
  imports: [
    SharedModule,
    ButtonModule,
    FontAwesomeModule,
    UnidadeOperacionalHistoricoTableComponent,
    UnidadeOperacionalHistoricoFilterComponent
  ],
  templateUrl: './unidade-operacional-historico.component.html',
  styleUrl: './unidade-operacional-historico.component.scss'
})
export class UnidadeOperacionalHistoricoComponent implements OnDestroy, OnInit {
  @ViewChild('filterForm', { static: false })
  filterForm!: UnidadeOperacionalHistoricoFilterComponent;

  breadcrumb: any[] = [
    { label: 'Unidade Operacional', route: '/unidade-operacional' },
    { label: 'Histórico de Ações', route: '/historico' },
  ];
  dataSource: Page<HistoricoAcoes> = PageImpl.of([], 0);

  private readonly destroy$ = new Subject<void>();
  private readonly searchTrigger$ = new Subject<Pageable | undefined>();

  constructor(
    private readonly router: Router,
    private readonly unidadeOperacionalService: UnidadeOperacionalService,
    private readonly route: ActivatedRoute,
    private readonly datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.search(); 
        }
      });

    this.searchTrigger$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((pageable) => {
          const httpParams = new HttpParams({
            fromObject: {
              ...this.searchParams,
              page: pageable ? pageable.pageNumber.toString() : '0',
              size: pageable ? pageable.pageSize.toString() : '5',
            }
          });
          return this.unidadeOperacionalService.getLogs(httpParams, this.route.snapshot.params['id']);
        })
      )
      .subscribe(value => {
        this.dataSource = value;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTrigger$.complete();
  }

  reset(): void {
    this.filterForm.form.reset();
    this.dataSource = PageImpl.of([], 0);
    this.router.navigate([], {});
    this.search();
  }

  search(pageable?: Pageable): void {
    this.searchTrigger$.next(pageable);
  }

  onPageChanged(pageable: { first: number; rows: number }): void {
    const pageNumber = pageable.first / pageable.rows + 1;
    this.search(new Pageable(pageNumber - 1, pageable.rows));
  }

  get searchParams(): { [param: string]: string } {
    const searchParams = this.filterForm ? this.filterForm.form.value : {};
    if (searchParams['dataAcao']) {
      const data = new Date(searchParams['dataAcao']);
      searchParams['dataAcao'] = this.datePipe.transform(data, 'yyyy-MM-dd') ?? searchParams['dataAcao'];
    }
    return pickBy(searchParams, identity);
  }
}
