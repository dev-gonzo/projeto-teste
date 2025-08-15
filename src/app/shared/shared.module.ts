import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputTextModule } from 'primeng/inputtext';
import { InputMask } from 'primeng/inputmask';
import { Select } from 'primeng/select';
import { Fieldset } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FileUpload } from 'primeng/fileupload';
import { Dialog, DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { LogsUploadFileComponent } from './components/logs-upload-file/logs-upload-file.component';
import { ByteToSizePipe } from './pipes';
import { ConfirmLogoutComponent } from './components/confirm-logout/confirm-logout.component';

import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    BreadcrumbComponent,
    UploadFileComponent,
    LogsUploadFileComponent,
    ConfirmLogoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    InputTextModule,
    InputMask,
    Select,
    Fieldset,
    ButtonModule,
    Breadcrumb,
    FileUpload,
    Dialog,
    TableModule,
    ByteToSizePipe,
    DialogModule,
    ButtonModule,
    MenubarModule,
    AvatarModule
  ],
  providers: [DatePipe, MessageService],
  exports: [
    SidebarComponent,
    NavbarComponent,
    BreadcrumbComponent,
    UploadFileComponent,
    LogsUploadFileComponent,
    ConfirmLogoutComponent
  ],
})
export class SharedModule {}