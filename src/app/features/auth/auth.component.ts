import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SeoService } from '../../core/services';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  constructor(
    private readonly seoService: SeoService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    const content = 'About content with meta';
    this.seoService.setMetaDescription(content);
  }

  ngOnInit(): void {
    const content = 'Aplicação web' + ' Portal de Mídias';

    const title = 'Página de Autenticação';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }
}
