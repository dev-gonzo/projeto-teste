import { Routes } from '@angular/router';

export const demoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/demo.page').then(m => m.DemoPage),
  },
];