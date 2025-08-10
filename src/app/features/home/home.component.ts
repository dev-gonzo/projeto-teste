import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '../../shared/shared.module';
import { AuthService, SharedService } from '../../core/services';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [FontAwesomeModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomePageComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly activatedRoute: ActivatedRoute
  ) {}
}
