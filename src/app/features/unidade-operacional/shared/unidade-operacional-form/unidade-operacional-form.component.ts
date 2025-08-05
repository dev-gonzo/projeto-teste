import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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

import {
  Subject,
  debounceTime,
  switchMap,
  takeUntil,
} from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { Select } from 'primeng/select';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';

import { UnidadeOperacional, Municipio, Uf } from '../../../../shared/models';
import { MunicipioService } from '../../../../core/services';

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
export class UnidadeOperacionalFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() unidadeOperacional!: UnidadeOperacional | null;
  @Input() ufs?: Uf[] | null;

  private readonly buscaMunicipio$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  municipios: Municipio[] = [];
  form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly municipioService: MunicipioService
  ) {
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

  ngOnInit(): void {
    this.buscaMunicipio$
      .pipe(
        debounceTime(500),
        switchMap((query) => this.municipioService.query(query)),
        takeUntil(this.destroy$)
      )
      .subscribe((municipios) => {
        this.municipios = [...municipios];
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  buscarMunicipio(event: AutoCompleteCompleteEvent): void {
    this.buscaMunicipio$.next(event.query);
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
