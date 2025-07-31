import { Component, ViewChild } from '@angular/core';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services';
import { Router } from '@angular/router';
import { ConfirmLogoutComponent } from '../../../shared/components/confirm-logout/confirm-logout.component';

@Component({
  selector: 'sidebar-layout',
  standalone: false,
  templateUrl: './sidebar-layout.component.html',
})
export class SidebarLayoutComponent {
  isSidebarCollapsed = false;

  constructor(
    library: FaIconLibrary,
    private authService: AuthService,
    private router: Router
  ) {
    library.addIconPacks(fas);
  }

  @ViewChild(ConfirmLogoutComponent) logoutModal!: ConfirmLogoutComponent;

  openLogoutModal() {
    this.logoutModal.open();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  };

  cancelLogout() {
    this.logoutModal.close();
  };

  onCollapseChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
