import { Component, Input } from '@angular/core';

import { LogUpload } from '../../models';

@Component({
  selector: 'logs-upload-file',
  standalone: false,
  templateUrl: './logs-upload-file.component.html',
})
export class LogsUploadFileComponent {
  @Input() logs!: LogUpload;

  viewLogErros = false;

  abrirModalLog(): void {
    this.viewLogErros = true;
  }

  verifyErros(): boolean {
    return this.logErrosArray.length > 0;
  }

  get logErrosArray(): string[] {
    const erros = this.logs?.logErros;
    if (Array.isArray(erros)) return erros;
    if (typeof erros === 'string') return [erros];
    return [];
  }

}
