import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableModule } from 'primeng/table';

import { HistoricoAcoes, Page } from '../../../../shared/models';

@Component({
  selector: 'app-unidade-operacional-historico-table',
  standalone: true,
  imports: [CommonModule, TableModule, FontAwesomeModule],
  templateUrl: './unidade-operacional-historico-table.component.html',
  styleUrl: './unidade-operacional-historico-table.component.scss'
})

export class UnidadeOperacionalHistoricoTableComponent { 
  @Input() dataSource!: Page<HistoricoAcoes>;

  @Output() pageChanged = new EventEmitter();

  onPageChanged(pageable: any): void {
    this.pageChanged.emit(pageable);
  }
}
