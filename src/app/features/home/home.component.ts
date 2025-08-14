import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPermissaoPerfil, PermissaoPerfil } from '../../shared/models';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'primeng/api';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, SharedModule],
  templateUrl: './home.component.html'
})
export class HomePageComponent {
  public exibirMensagemAutoCadastro = false;
  total_usuarios = 400;
  total_unidades = 899;

  constructor(
    private readonly authService: AuthService,
  ) {
    const perfil = this.authService.getPermissaoPerfil();
    this.exibirMensagemAutoCadastro =
      perfil === PermissaoPerfil.AUTOCADASTRO || !isPermissaoPerfil(perfil);
  }
}
