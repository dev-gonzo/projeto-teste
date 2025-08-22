import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, WrapperComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent extends ColumnHostClass {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecione';
  @Input() id?: string;

  showDropdown = false;

  get selectId(): string {
    return this.id ?? `select-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return null;
    }

    const errors = this.control.errors;
    return typeof errors['message'] === 'string' ? errors['message'] : null;
  }

  get displayValue(): string {
    const selectedOption = this.options.find(opt => opt.value === this.control.value);
    return selectedOption?.label || '';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  selectOption(option: SelectOption): void {
    this.control.setValue(option.value);
    this.control.markAsTouched();
    this.showDropdown = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
      this.control.markAsTouched();
    }, 150);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select') && !target.closest('.custom-select-dropdown')) {
      this.showDropdown = false;
    }
  }
}
