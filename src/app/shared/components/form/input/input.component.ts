import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    WrapperComponent
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent extends ColumnHostClass {
  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() id?: string;
  @Input() mask?: string;

  get inputId(): string {
    return this.id ?? `input-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get error(): string | null {
    if (!this.control?.touched || !this.control.errors) return null;

    const errors = this.control.errors;
    return typeof errors['message'] === 'string' ? errors['message'] : null;
  }
}
