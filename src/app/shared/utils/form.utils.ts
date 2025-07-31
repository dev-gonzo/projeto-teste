import {
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormArray,
} from '@angular/forms';

export class FormUtils {
  static resetValue(
    form: FormGroup | AbstractControl | any,
    fields = []
  ): void {
    fields.forEach((field: string) => {
      form.get(field).setValue(null, { emitEvent: false });
      form.get(field).setErrors(null, { emitEvent: false });
      form.get(field).clearValidators();
      form.get(field).updateValueAndValidity();
    });
  }

  static clearValidators(
    form: FormGroup | AbstractControl | any,
    fields = []
  ): void {
    fields.forEach((field: string) => {
      form.get(field).clearValidators();
      form.get(field).updateValueAndValidity();
    });
  }

  static setValidators(
    form: FormGroup | AbstractControl | any,
    fields = [],
    validators: ValidatorFn | ValidatorFn[] | null
  ): void {
    fields.forEach((field: string) => {
      form.get(field).setValidators(validators);
      form.get(field).updateValueAndValidity();
    });
  }

  static setRequiredValidator(
    form: FormGroup | AbstractControl,
    fields = []
  ): void {
    this.setValidators(form, fields, Validators.required);
  }

  static enable(
    form: FormGroup | AbstractControl | any,
    fields = [],
    emitEvent = false
  ): void {
    fields.forEach((field: string) => {
      if (form.get(field) && !form.get(field).value) {
        form.get(field).enable({ emitEvent });
      }
    });
  }

  static disable(
    form: FormGroup | AbstractControl | any,
    fields = [],
    emitEvent = false,
    force = false
  ): void {
    fields.forEach((field: string) => {
      if (form.get(field) && (form.get(field).value || force)) {
        form.get(field).disable({ emitEvent });
      }
    });
  }

  // TODO: Retornar formulário inválido direto para evitar negação nos componentes
  static validate(form: FormGroup | FormArray | any): boolean {
    Object.keys(form.controls).forEach((key: string) => {
      const control = form.controls[key];
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity({ emitEvent: true });

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.validate(control);
      }
    });

    return !form.invalid;
  }
}
