import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
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

import { Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

import { UnidadeOperacional, Municipio, Uf, Endereco } from '../../../../shared/models';
import { EnderecoService } from '../../../../core/services';

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
    InputTextModule
  ],
  templateUrl: './unidade-operacional-form.component.html',
  styleUrl: './unidade-operacional-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnidadeOperacionalFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() unidadeOperacional: any | null = null;
  @Input() ufs: Uf[] | null = null;

  private readonly buscaMunicipio$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  municipios: Municipio[] = [];
  form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly enderecoService: EnderecoService
  ) {
    this.form = this.formBuilder.group({
      nomeUnidadeOperacional: [null, [Validators.required, Validators.maxLength(100)]],
      cep: [null, [Validators.maxLength(9)]],
      nomeLogradouro: [null, [Validators.maxLength(500)]],
      numeroLogradouro: [null, [Validators.maxLength(10)]],
      nomeComplemento: [null, [Validators.maxLength(500)]],
      nomeBairro: [null, [Validators.maxLength(100)]],
      municipioNome: [null],
      estadoSigla: [{ value: null, disabled: true }],
      numeroTelefonePrincipal: [null, [Validators.maxLength(11)]],
      numeroTelefoneSecundario: [null, [Validators.maxLength(11)]],
      responsavelUnidadeOperacional: [null, [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.buscaMunicipio$
      .pipe(
        debounceTime(500),
        switchMap((query) => this.enderecoService.getMunicipiosPorNome(query)),
        takeUntil(this.destroy$)
      )
      .subscribe((municipios) => {
        this.municipios = [...municipios];
        this.cdr.detectChanges();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['unidadeOperacional'] && this.unidadeOperacional) {
      const endereco: Endereco = this.unidadeOperacional.endereco;

      this.form.patchValue({
        nomeUnidadeOperacional: this.unidadeOperacional.nomeUnidadeOperacional,
        responsavelUnidadeOperacional: this.unidadeOperacional.responsavelUnidadeOperacional,
        numeroTelefonePrincipal: this.unidadeOperacional.numeroTelefonePrincipal,
        numeroTelefoneSecundario: this.unidadeOperacional.numeroTelefoneSecundario,
        cep: endereco?.cep,
        nomeLogradouro: endereco?.logradouro,
        numeroLogradouro: endereco?.numero,
        nomeComplemento: endereco?.complemento,
        nomeBairro: endereco?.bairro,
        municipioNome: endereco?.municipioNome,
        estadoSigla: endereco?.estadoSigla || null
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAtributo(atributo: string): AbstractControl {
    return this.form.get(atributo) as AbstractControl;
  }

  buscarMunicipio(event: AutoCompleteCompleteEvent): void {
    this.buscaMunicipio$.next(event.query);
  }

  setUf(event: AutoCompleteSelectEvent): void {
    const municipio: Municipio = event.value;
    if (municipio?.uf?.sigla) {
      this.form.get('estadoSigla')?.setValue(municipio.uf.sigla);
    }
  }

  onCepBlur(): void {
    const cep = this.getAtributo('cep').value?.replace(/\D/g, '');

    if (cep && cep.length === 8) {
      this.enderecoService.getEnderecoPorCEP(cep).subscribe((endereco: Endereco) => {
        this.form.patchValue({
          municipio: {
            codigoIbge: endereco.municipio?.codigoIbge,
            nomeLogradouro: endereco.logradouro,
            nomeBairro: endereco.bairro,
            nomeComplemento: endereco.complemento ?? '',
            municipioNome: endereco.municipioNome,
            estadoSigla: endereco.estadoSigla || null,
          }
        });
        this.cdr.detectChanges();
      });
    }
  }
}
