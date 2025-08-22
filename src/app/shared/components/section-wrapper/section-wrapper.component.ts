import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-section-wrapper',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './section-wrapper.component.html',
  styleUrls: ['./section-wrapper.component.scss']
})
export class SectionWrapperComponent  {
 @Input() title = '';

}