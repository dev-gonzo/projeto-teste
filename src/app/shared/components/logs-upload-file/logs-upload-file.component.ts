import { Component, Input } from '@angular/core';

import { LogUpload } from '../../models';

@Component({
  selector: 'logs-upload-file',
  standalone: false,
  templateUrl: './logs-upload-file.component.html',
})
export class LogsUploadFileComponent {
  @Input() logs: LogUpload | any;

  viewLogErros = false;

  abrirModalLog(): void {
    this.viewLogErros = true;
  }

  verifyErros(): boolean {
    if (typeof this.logs.logErros === 'string') {
      return false;
    } else {
      return true;
    }
  }
}
