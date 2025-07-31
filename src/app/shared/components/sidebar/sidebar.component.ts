import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { faGear, faVideo, faArrowUpFromBracket, faTv } from '@fortawesome/free-solid-svg-icons';

import { SidebarLinkModel } from '../../models';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  currentRoute: string = '';
  aberto: number | null = null;
  isCollapsed = false;

  @Output() openLogoutModal = new EventEmitter<void>();
  @Output() collapseChange = new EventEmitter<boolean>();

  constructor(private readonly router: Router) {
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

  confirmLogout() {
    this.openLogoutModal.emit();
  }

  logout() {
    this.router.navigate(['/auth/login']);
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
    this.aberto = this.aberto === i ? null : i;
  }

}
