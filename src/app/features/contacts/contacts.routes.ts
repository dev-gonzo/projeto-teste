import { Routes } from '@angular/router';


import { LayoutMainComponent } from '@app/layouts/layout-main/layout-main.component';

export const CONTACTS_ROUTES: Routes = [
  {
    path: 'contato',
    children: [
      {
        path: '',
        component: LayoutMainComponent,
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/contact-us.page').then(
                (m) => m.ContactUsPageComponent,
              ),
            
          },
        ],
      },
    ],
  },
];
