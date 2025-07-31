import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { PrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

import { SidebarLayoutModule } from './core/layouts/sidebar-layout/sidebar-layout.module';
import { SharedModule } from './shared/shared.module';

// Possible preset for theme;
// import Aura from '@primeng/themes/aura';
// import Material from '@primeng/themes/material';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // imports: [RouterOutlet, SidebarLayoutModule, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Oitiva Digital';

  constructor(library: FaIconLibrary, private primeng: PrimeNG) {
    library.addIconPacks(fas);
    this.primeng.theme.set({
      preset: Lara,
      options: {
        darkModeSelector: false || 'none',
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
      },
    });
  }
}
