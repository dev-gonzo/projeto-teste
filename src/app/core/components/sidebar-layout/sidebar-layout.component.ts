import { Component, OnInit, OnDestroy } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'sidebar-layout',
  standalone: false,
  templateUrl: './sidebar-layout.component.html',
})
export class SidebarLayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  isMobile = false;
  readonly dimensao_tela_mobile = 900;

  private resizeSubscription!: Subscription;

  constructor(
    library: FaIconLibrary,
    private readonly router: Router
  ) {
    library.addIconPacks(fas);
  }

  ngOnInit() {
    this.checkIsMobile();

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.checkIsMobile();
      });
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  private checkIsMobile(): void {
    this.isMobile = window.innerWidth <= this.dimensao_tela_mobile;
  }

  onCollapseChange(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}
