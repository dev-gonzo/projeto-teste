import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuItem, MENU_ITEMS } from '../../../core/constants/menu-items.constant';

@Component({
  selector: 'app-spacer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './spacer-sidebar.component.html',
  styleUrls: ['./spacer-sidebar.component.scss']
})
export class SpacerSidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = MENU_ITEMS;
  @Input() isExpanded = true;
  private library = inject(FaIconLibrary);


  ngOnInit(): void {
    
    this.sidebarStateChange.emit(this.isExpanded);
  }





}