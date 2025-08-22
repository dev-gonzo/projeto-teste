import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import { ThemeState } from '@app/design/theme/theme.state';
import { AccessibilityControlsComponent } from '@app/shared/components/accessibility-controls/accessibility-controls.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [FontAwesomeModule, AccessibilityControlsComponent],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() isSidebarOpen = false;

  
  faBars = faBars;
  faTimes = faTimes;

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
