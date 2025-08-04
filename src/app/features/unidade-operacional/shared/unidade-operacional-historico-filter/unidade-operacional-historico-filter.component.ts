import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { TIPO_OPERACAO } from '../../../../shared/constants';

@Component({
  selector: 'app-unidade-operacional-historico-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, Select, DatePicker],
  templateUrl: './unidade-operacional-historico-filter.component.html',
  styleUrl: './unidade-operacional-historico-filter.component.scss'
})
export class UnidadeOperacionalHistoricoFilterComponent {
  form: FormGroup;
  hoje = new Date();

  acoes = TIPO_OPERACAO;

  constructor(public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      nomeUsuario: [null],
      dataAcao: [null],
      acao: [null],
    });
  }
}
