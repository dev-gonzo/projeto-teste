import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ThemeState } from '@app/design/theme/theme.state';

@Component({
  selector: 'app-accessibility-controls',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './accessibility-controls.component.html',
  styleUrls: ['./accessibility-controls.component.scss']
})
export class AccessibilityControlsComponent {
  @Input() buttonColor?: string;
  @Input() buttonClass?: string;
  theme = inject(ThemeState);

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  increaseFont(): void {
    this.theme.adjustFontSize('increase');
  }

  decreaseFont(): void {
    this.theme.adjustFontSize('decrease');
  }

  resetFont(): void {
    this.theme.resetFontSize();
  }
}