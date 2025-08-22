import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertService, AlertType } from './alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  alertService = inject(AlertService);

  getAlertClasses(type: AlertType): string {
    const baseClasses = 'border-start border-5';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-success-subtle border-success text-success-emphasis`;
      case 'danger':
        return `${baseClasses} bg-danger-subtle border-danger text-danger-emphasis`;
      case 'warning':
        return `${baseClasses} bg-warning-subtle border-warning text-warning-emphasis`;
      case 'info':
        return `${baseClasses} bg-info-subtle border-info text-info-emphasis`;
      default:
        return `${baseClasses} bg-info-subtle border-info text-info-emphasis`;
    }
  }

  getIconClass(type: AlertType): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'danger':
        return 'fas fa-exclamation-triangle';
      case 'warning':
        return 'fas fa-exclamation-circle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  }

  closeAlert(id: string): void {
    this.alertService.remove(id);
  }
}