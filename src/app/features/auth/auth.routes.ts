import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/login/login.page').then((m) => m.LoginPage),
          },
        ],
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/register/register.page').then(
                (m) => m.RegisterPage,
              ),
          },
        ],
      },
    ],
  },
];
