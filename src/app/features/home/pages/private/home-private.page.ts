import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';

@Component({
  standalone: true,
  selector: 'app-home-private',
  imports: [CommonModule, SectionWrapperComponent],
  templateUrl: './home-private.page.html',
})
export class HomePrivatePage {
  namePrincipa = 'aaa';


}
