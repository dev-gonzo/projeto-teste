import { Pipe, PipeTransform } from '@angular/core';

import { CepUtils } from '../utils';

@Pipe({
  name: 'cep',
  standalone: true,
})
export class CepPipe implements PipeTransform {
  transform(value: string): string {
    return CepUtils.format(value);
  }
}
