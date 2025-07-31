import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  usuario = "Nome do Usuário";
  unidade_operacional = "Unidade Operacional";
  unidade_operacional_atual = "70 DP Tatuapé"
}
