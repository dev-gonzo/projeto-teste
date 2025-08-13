import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERROR_MESSAGES } from '../../constants/mensagens';

@Component({
  selector: 'app-nao-encontrada',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nao-encontrada.component.html',
  styleUrl: './nao-encontrada.component.scss'
})
export class NaoEncontradaComponent {
  messages = ERROR_MESSAGES.NOT_FOUND;
}
