import { Routes } from '@angular/router';

import { HOME_ROUTES } from './features/home/home.routes';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { CONTACTS_ROUTES } from './features/contacts/contacts.routes';
import { demoRoutes } from './features/demo/demo.routes';
import { LayoutMainComponent } from './layouts/layout-main/layout-main.component';
import { NOT_FOUND_ROUTES } from './features/not-found/not-found.routes';

export const routes: Routes = [
  ...HOME_ROUTES,
  ...AUTH_ROUTES,
  ...CONTACTS_ROUTES,
  {
    path: 'demo',
    component: LayoutMainComponent,
    children: demoRoutes,
  },
  ...NOT_FOUND_ROUTES,
];
