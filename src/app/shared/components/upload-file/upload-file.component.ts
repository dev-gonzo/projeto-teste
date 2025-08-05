import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { Subscription } from 'rxjs';
import { UploadApiService } from '../../models/uploads.model';

@Component({
  selector: 'upload-file',
  standalone: false,
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class UploadFileComponent implements OnDestroy {
  @Input() apiService!: UploadApiService;
  @Input() titleHeader = '';
  @Output() logs = new EventEmitter();
  @Input() downloadFilename = 'usuarios.xlsx';

  uploadedFiles: any[] = [];
  invalidFileTypeMessageSummary = 'Tipo de arquivo inválido;';
  invalidFileTypeMessageDetail = "Formato aceito '.xlsx'";
  invalidFileSizeMessageSummary = 'Arquivo muito grande;';
  invalidFileSizeMessageDetail = 'Tamanho máximo suportado: 2GB';

  private subscription!: Subscription;

  constructor(private readonly messageService: MessageService) { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.logs.emit(event.originalEvent);
  }

  baixarModelo(): void {
    this.subscription = this.apiService
      .baixarModelo()
      .subscribe((value: Blob) => {
        const url = window.URL.createObjectURL(value);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = this.downloadFilename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  }
}
