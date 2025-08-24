import { Routes } from '@angular/router';

import { AUTH_ROUTES } from './features/auth/auth.routes';
import { CONTACTS_ROUTES } from './features/contacts/contacts.routes';
import { DEMO_ROUTES } from './features/demo/demo.routes';
import { HOME_ROUTES } from './features/home/home.routes';
import { NOT_FOUND_ROUTES } from './features/not-found/not-found.routes';

export const routes: Routes = [
  ...HOME_ROUTES,
  ...AUTH_ROUTES,
  ...CONTACTS_ROUTES,
  ...DEMO_ROUTES,
  ...NOT_FOUND_ROUTES,
];
