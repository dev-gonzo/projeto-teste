import { SplitButton } from 'primeng/splitbutton';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UnidadeOperacional, Page } from '../../../../shared/models';
import { Router } from '@angular/router';
import { CepPipe } from '../../../../shared/pipes';

@Component({
  selector: 'app-unidade-operacional-table',
  standalone: true,
  imports: [CommonModule, TableModule, FontAwesomeModule, SplitButton, CepPipe],
  templateUrl: './unidade-operacional-table.component.html',
  styleUrl: './unidade-operacional-table.component.scss'
})
export class UnidadeOperacionalTableComponent {
  @Input() dataSource!: Page<UnidadeOperacional>;

  @Output() pageChanged = new EventEmitter();
  @Output() remove = new EventEmitter<UnidadeOperacional>();
  @Output() edit = new EventEmitter<UnidadeOperacional>();

  constructor(private readonly router: Router) { }

  row!: UnidadeOperacional;

  model: MenuItem[] = [
    {
      id: 'edit',
      label: 'Editar',
      icon: 'fa fa-pencil',
      command: () => this.onEdit(),
    },
    {
      id: 'remove',
      label: 'Remover',
      icon: 'fa fa-trash',
      command: () => this.onRemove(),
    },
    {
      id: 'historico',
      label: 'Histórico de ações',
      icon: 'pi pi-eye',
      command: () => this.onHistorico(),
    }
  ];

  onDropdownClick(row: UnidadeOperacional): void {
    this.row = row;
  }

  onPageChanged(pageable: any): void {
    this.pageChanged.emit(pageable);
  }

  onEdit(): void {
    this.edit.emit(this.row);
  }

  onRemove(): void {
    this.remove.emit(this.row);
  }

  onHistorico() {
    this.router.navigate(['unidade-operacional/historico-acoes', this.row.id]);
  }
}
