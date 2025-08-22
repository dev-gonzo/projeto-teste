import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDesktop, faVideo, faUpload, faBuilding, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import { MenuItem, MENU_ITEMS } from '../../../core/constants/menu-items.constant';

@Component({
  selector: 'app-desktop-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './desktop-sidebar.component.html',
  styleUrls: ['./desktop-sidebar.component.scss']
})
export class DesktopSidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = MENU_ITEMS;
  isExpanded = true;
  private library = inject(FaIconLibrary);
  private readonly STORAGE_KEY = 'sidebar-expanded';

  ngOnInit(): void {
    
    this.library.addIcons(faDesktop, faVideo, faUpload, faBuilding, faCog, faBars);
    this.loadSidebarState();
     
    
    this.sidebarStateChange.emit(this.isExpanded);
  }



  private loadSidebarState(): void {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      this.isExpanded = savedState === 'true';
    }
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
    localStorage.setItem('sidebar-expanded', this.isExpanded.toString());
    this.sidebarStateChange.emit(this.isExpanded);
  }

  onMenuItemClick(_item: MenuItem): void {
    return;
  }

  onSettingsClick(): void {
    return;
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