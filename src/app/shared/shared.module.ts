import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { MenubarModule } from 'primeng/menubar';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    MenubarModule

  ],
  exports: [
    SidebarComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
