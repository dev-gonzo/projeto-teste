import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteToSize',
  standalone: true,
})
export class ByteToSizePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    if (value === 0) {
      return '0 Bytes';
    }
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(value) / Math.log(1024));
    const result = (value / Math.pow(1024, i)).toFixed(2);
    return `${result} ${sizes[i]}`;
  }
}
