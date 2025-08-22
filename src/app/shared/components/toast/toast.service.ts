import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal<string | null>(null);
  type = signal<ToastType>('info');
  visible = signal(false);
  private lastType: ToastType | null = null;

  show(msg: string, type: ToastType = 'info'): void {
    this.message.set(msg);
    this.type.set(type);
    this.visible.set(true);
    
    
    const duration = this.lastType === type ? 2000 : 4000;
    this.lastType = type;
    
    setTimeout(() => this.visible.set(false), duration);
  }

  success(msg: string): void {
    this.show(msg, 'success');
  }
  error(msg: string): void {
    this.show(msg, 'error');
  }
  info(msg: string): void {
    this.show(msg, 'info');
  }
  warning(msg: string): void {
    this.show(msg, 'warning');
  }
}
