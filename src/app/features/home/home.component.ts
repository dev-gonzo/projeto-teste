import { Component } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [FontAwesomeModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomePageComponent {
  constructor() { }

  total_usuarios = 400;
  total_unidades = 899;

}
