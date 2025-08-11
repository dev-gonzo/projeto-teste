import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { faGear, faVideo, faArrowUpFromBracket, faTv, faBuildingShield } from '@fortawesome/free-solid-svg-icons';

import { SidebarLinkModel } from '../../models';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  currentRoute: string = '';
  isCollapsed = false;

  @Output() collapseChange = new EventEmitter<boolean>();
  @Output() openLogoutModal = new EventEmitter<void>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.currentRoute = this.router.url;
  }

  sidebarRoutes: SidebarLinkModel[] = [
    {
      icon: faTv,
      title: 'Dashboard',
      url: '/home',
    },
    {
      icon: faVideo,
      title: 'Oitiva',
      url: '/oitiva',
    },
    {
      icon: faArrowUpFromBracket,
      title: 'Upload de mídia',
      url: '/upload',
    },
    {
      icon: faBuildingShield,
      title: 'Unidade Operacional',
      url: '/unidade-operacional',
    }
  ];

  sidebarDownRoutes: SidebarLinkModel[] = [
    {
      icon: faGear,
      title: 'Configurações',
      url: '/',
    },
  ];

  updateRoute(newUrl: string): void {
    this.currentRoute = newUrl;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChange.emit(this.isCollapsed);
  }

  open(i: number) {
    if (this.isCollapsed) {
      this.isCollapsed = false;

      this.collapseChange.emit(false);
    }
  }

  confirmLogout() {
    this.openLogoutModal.emit();
  }

  logout() {
    this.authService.logout().subscribe({ error: (err) => console.error("Falha ao realizar logout.") });
  }
}
