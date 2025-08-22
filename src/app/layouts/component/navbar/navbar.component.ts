import { Component, EventEmitter, Output, Input, inject, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes, faExchangeAlt, faUser, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';

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

  isUserDropdownOpen = false;
  
  faBars = faBars;
  faTimes = faTimes;
  faExchange = faExchangeAlt;
  faUser = faUser;
  faSignOut = faSignOutAlt;
  faBell = faBell;

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

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  goToProfile(event: Event): void {
    event.preventDefault();
    this.isUserDropdownOpen = false;
    
    
  }

  logout(event: Event): void {
    event.preventDefault();
    this.isUserDropdownOpen = false;
    
    
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    
    if (!dropdown && this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }
}
