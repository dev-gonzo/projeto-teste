import { Routes } from '@angular/router';

export const DEMO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/demo.page').then(m => m.DemoPage),
  },
];