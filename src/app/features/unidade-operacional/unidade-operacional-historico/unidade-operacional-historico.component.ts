import { map } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UnidadeOperacionalHistoricoFilterComponent } from '../shared/unidade-operacional-historico-filter/unidade-operacional-historico-filter.component';
import { HistoricoAcoes, Page, Pageable, PageImpl } from '../../../shared/models';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadeOperacionalApiService } from '../../../core/services';
import { HttpParams } from '@angular/common/http';
import { identity, pickBy } from 'lodash-es';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UnidadeOperacionalHistoricoTableComponent } from '../shared/unidade-operacional-historico-table/unidade-operacional-historico-table.component';
import { DatePipe } from '@angular/common';

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

  private subscription!: Subscription;

  constructor(
    private readonly router: Router,
    private readonly unidadeOperacionalService: UnidadeOperacionalApiService,
    private readonly route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.search();
      }
    });
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
    let httpParams = new HttpParams({
      fromObject: {
        ...this.searchParams,
        page: pageable ? pageable.pageNumber : '0',
        size: pageable ? pageable.pageSize : '5',
      },
    });

    this.subscription = this.unidadeOperacionalService
      .getLogs(httpParams, this.route.snapshot.params['id'])
      .pipe(
        map((value) => {
          value.data.forEach((item) => {
            const horaFormatada = item.horaAcao?.slice(0, 8);
            item.horaAcao = horaFormatada;
          });

          return value;
        })
      )
      .subscribe((value) => {
        this.dataSource = value;
      });

  }

  onPageChanged(pageable: { first: number; rows: number }): void {
    const pageNumber = pageable.first / pageable.rows + 1;
    this.search(new Pageable(pageNumber - 1, pageable.rows));
  }

  get searchParams(): { [param: string]: string } {
    const searchParams = this.filterForm ? this.filterForm.form.value : {};
    const datePipe = new DatePipe('pt-BR');

    if (searchParams['dataAcao']) {
      const data = new Date(searchParams['dataAcao']);
      searchParams['dataAcao'] = datePipe.transform(data, 'yyyy-MM-dd') ?? searchParams['dataAcao'];
    }
    return pickBy(searchParams, identity);
  }
}
