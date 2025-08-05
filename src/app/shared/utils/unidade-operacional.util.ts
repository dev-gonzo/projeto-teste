import { FormArray, FormGroup } from "@angular/forms";
import { UnidadeOperacional } from "../models";
import { transformarTelefones } from "./telefone.utils";


export class Prepare {
  private readonly value: UnidadeOperacional;

  constructor(form: FormGroup | FormArray, id?: number) {
    const rawValue = form.getRawValue();

    this.value = id
      ? { ...rawValue, id }
      : rawValue;
  }

  public toUnidadeOperacional(): UnidadeOperacional {
    return transformarTelefones(this.value);
  }
}
