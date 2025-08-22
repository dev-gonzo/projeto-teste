import { Directive, HostBinding, Input } from '@angular/core';

@Directive()
export abstract class ColumnHostClass {
  @Input() col: number | string | null = null;
  @Input() colMd: number | string | null = null;
  @Input() colLg: number | string | null = null;
  @Input() colXl: number | string | null = null;

  @HostBinding('class')
  get hostClass(): string {
    const classes: string[] = [];

    if (this.col) {
      classes.push(`col-${this.col}`);
    }

    if (this.colMd) {
      classes.push(`col-md-${this.colMd}`);
    }

    if (this.colLg) {
      classes.push(`col-lg-${this.colLg}`);
    }

    if (this.colXl) {
      classes.push(`col-xl-${this.colXl}`);
    }

    return classes.join(' ');
  }
}
