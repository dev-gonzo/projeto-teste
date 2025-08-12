import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services';
import { ConfirmLogoutComponent } from '../../../shared/components/confirm-logout/confirm-logout.component';

@Component({
  selector: 'sidebar-layout',
  standalone: false,
  templateUrl: './sidebar-layout.component.html',
})
export class SidebarLayoutComponent implements OnInit, OnDestroy {
  @ViewChild(ConfirmLogoutComponent, { static: true }) logoutModal!: ConfirmLogoutComponent;
  isSidebarCollapsed = false;
  isMobile = false;
  readonly dimensao_tela_mobile = 900;

  private resizeSubscription!: Subscription;

  constructor(
    library: FaIconLibrary,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
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

  openLogoutModal() {
    this.logoutModal.open();
  }

  logout() {
    this.authService.logout()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.router.navigate(['/auth/login']);
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao encerrar a sessão. Tente novamente.'
          });
        }
      });
  }

  cancelLogout() {
    this.logoutModal.close();
  };
}
