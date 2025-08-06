import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-unidade-operacional-filter',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './unidade-operacional-filter.component.html',
  styleUrl: './unidade-operacional-filter.component.scss'
})
export class UnidadeOperacionalFilterComponent {
  form: FormGroup;

  constructor(public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      nomeUnidadeOperacional: [null],
      cep: [null],
      nomeMunicipio: [null],
    });
  }
}
