import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';

@Component({
  standalone: true,
  selector: 'app-home-public',
  imports: [CommonModule, SectionWrapperComponent],
  templateUrl: './home-public.page.html',
})
export class HomePublicPage {}
