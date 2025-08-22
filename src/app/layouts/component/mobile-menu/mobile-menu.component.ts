import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faDesktop, faVideo, faUpload, faBuilding, faCog } from '@fortawesome/free-solid-svg-icons';
import { MenuItem, MENU_ITEMS } from '../../../core/constants/menu-items.constant';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() menuItemClick = new EventEmitter<MenuItem>();

  menuItems: MenuItem[] = MENU_ITEMS;
  private library = inject(FaIconLibrary);

  ngOnInit(): void {
    this.library.addIcons(faTimes, faDesktop, faVideo, faUpload, faBuilding, faCog);
  }

  onMenuItemClick(item: MenuItem): void {
    this.menuItemClick.emit(item);
    this.closeMenu.emit();
  }

  onBackdropClick(): void {
    this.closeMenu.emit();
  }

  onSettingsClick(): void {
    this.closeMenu.emit();
  }

  getIconName(iconClass: string): string {
    
    const iconMap: { [key: string]: string } = {
      'fas fa-desktop': 'desktop',
      'fas fa-video': 'video',
      'fas fa-upload': 'upload',
      'fas fa-building': 'building'
    };
    
    return iconMap[iconClass] || 'desktop';
  }
}