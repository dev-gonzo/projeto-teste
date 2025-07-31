import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideNgxMask } from 'ngx-mask';
import { providePrimeNG } from 'primeng/config';
// import Material from '@primeng/themes/material';

import { routes } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core/interceptors/authInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    provideNgxMask({
      /* opções de cfg */
    }),
    importProvidersFrom(SharedModule),
    provideAnimationsAsync(),
    providePrimeNG({
    //   theme: {
    //     preset: Material
    // }
    }),
  ],
};
