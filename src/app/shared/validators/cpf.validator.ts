import { AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

import { CpfUtils } from '../utils';

@Directive({
  selector: '[msCpf]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MsCpfValidator,
      multi: true,
    },
  ],
})
export class MsCpfValidator {
  static validate(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    return CpfUtils.validate(control.value) ? null : { cpf: true };
  }
}
