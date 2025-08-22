import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeState } from './design/theme/theme.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast />
  `,
})
export class AppComponent {
  private readonly _theme = inject(ThemeState);
}
