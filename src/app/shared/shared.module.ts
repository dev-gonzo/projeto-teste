import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedService } from '../core/services';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConfirmLogoutComponent } from './components/confirm-logout/confirm-logout.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { MenubarModule } from 'primeng/menubar';

@NgModule({
  declarations: [
    SidebarComponent,
    ConfirmLogoutComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    MenubarModule

  ],
  providers: [
    SharedService
  ],
  exports: [
    SidebarComponent,
    ConfirmLogoutComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
