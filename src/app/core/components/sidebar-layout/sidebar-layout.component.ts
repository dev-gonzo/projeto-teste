import { Component, HostListener } from '@angular/core';

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
  isMobile = false;
  readonly dimensao_tela_mobile = 900;
  
  constructor(
    library: FaIconLibrary,
    private readonly router: Router
  ) {
    library.addIconPacks(fas);
  }
  
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= this.dimensao_tela_mobile;
  }

  ngOnInit() {
    this.onResize();
  }

  onCollapseChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
