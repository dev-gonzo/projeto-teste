import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SidebarLayoutComponent } from '../../components/sidebar-layout/sidebar-layout.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    SidebarLayoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FontAwesomeModule,
  ]
})
export class SidebarLayoutModule { }
