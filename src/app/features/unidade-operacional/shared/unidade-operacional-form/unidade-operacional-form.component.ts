import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subscription, debounceTime } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { Select } from 'primeng/select';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';

import { UnidadeOperacional, Municipio, Uf } from '../../../../shared/models';
import { MunicipioApiService } from '../../../../core/services';

@Component({
  selector: 'app-unidade-operacional-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    CommonModule,
    AutoComplete,
    Select,
  ],
  templateUrl: './unidade-operacional-form.component.html',
  styleUrl: './unidade-operacional-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UnidadeOperacionalFormComponent implements OnChanges, OnDestroy {
  @Input() unidadeOperacional!: UnidadeOperacional | null;
  @Input() ufs: Uf[] | any = [];
  @Input() municipioService!: MunicipioApiService;

  municipios: Municipio[] = [];
  form: FormGroup;

  private subscription!: Subscription;

  constructor(public formBuilder: FormBuilder, private readonly cdr: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
      nomeUnidadeOperacional: [null, [Validators.required, Validators.maxLength(100)]],
      cep: [null, [Validators.maxLength(8)]],
      nomeLogradouro: [null, [Validators.maxLength(500)]],
      numeroLogradouro: [null, [Validators.maxLength(10)]],
      nomeComplemento: [null, [Validators.maxLength(500)]],
      nomeBairro: [null, [Validators.maxLength(100)]],
      municipio: [null],
      uf: [{ value: null, disabled: true }],
      telefonePrincipal: [null, [Validators.maxLength(11)]],
      telefoneSecundario: [null, [Validators.maxLength(11)]],
      nomeResponsavelUnidade: [null, [Validators.maxLength(500)]],
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(): void {
    if (this.unidadeOperacional) {
      this.form.patchValue({ ...this.unidadeOperacional });

      if (this.unidadeOperacional.telefonePrincipal && this.unidadeOperacional.telefoneDDD) {
        this.getAtributo('telefonePrincipal')?.setValue(
          this.unidadeOperacional.telefoneDDD + this.unidadeOperacional.telefonePrincipal
        );
      }
      if (
        this.unidadeOperacional.telefoneSecundario &&
        this.unidadeOperacional.telefoneSecundarioDDD
      ) {
        this.getAtributo('telefoneSecundario')?.setValue(
          this.unidadeOperacional.telefoneSecundarioDDD +
          this.unidadeOperacional.telefoneSecundario
        );
      }
    }
  }

  buscarMunicipio(nome: AutoCompleteCompleteEvent): void {
    this.subscription = this.municipioService
      .query(nome.query)
      .pipe(debounceTime(500))
      .subscribe((municipios) => {
        this.municipios = [...municipios];
        this.cdr.detectChanges();
      });
  }

  setUf(municipio: AutoCompleteSelectEvent): void {
    if (municipio?.value?.uf) {
      this.getAtributo('uf').setValue(municipio.value.uf);
    }
  }

  getAtributo(atributo: string): AbstractControl {
    return this.form.get(atributo) as AbstractControl;
  }
}
