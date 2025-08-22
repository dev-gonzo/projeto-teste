import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

export interface MultiSelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-form-multi-select',
  standalone: true,
  imports: [CommonModule, WrapperComponent],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class MultiSelectComponent extends ColumnHostClass {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() options: MultiSelectOption[] = [];
  @Input() placeholder = 'Selecione';
  @Input() id?: string;
  @Input() maxSelections?: number;

  showDropdown = false;

  get selectId(): string {
    return this.id ?? `multi-select-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return null;
    }

    const errors = this.control.errors;
    return typeof errors['message'] === 'string' ? errors['message'] : null;
  }

  get selectedValues(): (string | number)[] {
    return Array.isArray(this.control.value) ? this.control.value : [];
  }

  get displayValue(): string {
    const selectedOptions = this.options.filter(opt => 
      this.selectedValues.includes(opt.value)
    );
    
    if (selectedOptions.length === 0) {
      return '';
    }
    
    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }
    
    return `${selectedOptions.length} itens selecionados`;
  }

  get selectedLabels(): string[] {
    return this.options
      .filter(opt => this.selectedValues.includes(opt.value))
      .map(opt => opt.label);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  toggleOption(option: MultiSelectOption, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    const currentValues = this.selectedValues;
    let newValues: (string | number)[];
    
    if (this.isOptionSelected(option)) {
      
      newValues = currentValues.filter(value => value !== option.value);
    } else {
      
      if (this.maxSelections && currentValues.length >= this.maxSelections) {
        return; 
      }
      newValues = [...currentValues, option.value];
    }
    
    this.control.setValue(newValues);
    this.control.markAsTouched();
    
  }

  isOptionSelected(option: MultiSelectOption): boolean {
    return this.selectedValues.includes(option.value);
  }

  isOptionDisabled(option: MultiSelectOption): boolean {
    if (this.isOptionSelected(option)) {
      return false; 
    }
    
    return this.maxSelections ? this.selectedValues.length >= this.maxSelections : false;
  }

  removeSelectedOption(option: MultiSelectOption, event: Event): void {
    event.stopPropagation();
    const newValues = this.selectedValues.filter(value => value !== option.value);
    this.control.setValue(newValues);
    this.control.markAsTouched();
  }

  clearAll(): void {
    this.control.setValue([]);
    this.control.markAsTouched();
  }

  onBlur(): void {
    
    this.control.markAsTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (!target.closest('.custom-multi-select') && !target.closest('.custom-multi-select-dropdown')) {
      this.showDropdown = false;
    }
    
    if (target.closest('.custom-multi-select-option')) {
      return;
    }
  }
}