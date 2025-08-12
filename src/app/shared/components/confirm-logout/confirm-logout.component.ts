import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-confirm-logout',
  standalone: false,
  templateUrl: './confirm-logout.component.html',
  styleUrl: './confirm-logout.component.scss'
})
export class ConfirmLogoutComponent {
  display: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {

  }

  @Input() message: string = 'Deseja mesmo sair do sistema?';

  @Output() confirmLogout = new EventEmitter<void>();
  @Output() cancelLogout = new EventEmitter<void>();

  open() {
    this.display = true;
  }

  close() {
    this.display = false;
  }

  confirm() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.confirmLogout.emit();
        this.close();
      },
      error: (err) => {
        console.error('Erro no logout:', err);
      }
    });
  }

  cancel() {
    this.cancelLogout.emit();
    this.close();
  }

}

