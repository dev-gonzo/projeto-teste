import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERROR_MESSAGES } from '../../constants/mensagens';

@Component({
  selector: 'app-nao-autorizado',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nao-autorizado.component.html',
  styleUrls: ['./nao-autorizado.component.scss']
})
export class NaoAutorizadoComponent {
  messages = ERROR_MESSAGES.UNAUTHORIZED;
}
