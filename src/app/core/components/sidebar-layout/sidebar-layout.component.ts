import { Component, ViewChild } from '@angular/core';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar-layout',
  standalone: false,
  templateUrl: './sidebar-layout.component.html',
})
export class SidebarLayoutComponent {
  isSidebarCollapsed = false;

  constructor(
    library: FaIconLibrary,
    private readonly router: Router
  ) {
    library.addIconPacks(fas);
  }

  onCollapseChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
