import { Routes } from '@angular/router';
import { SidebarLayoutComponent } from './core/components/sidebar-layout/sidebar-layout.component';
import { HomePageComponent } from './features/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: SidebarLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomePageComponent
            },
            {
                path: 'unidade-operacional',
                loadChildren: () =>
                    import('./features/unidade-operacional/unidade-operacional.routes').then(
                        (routes) => routes.routes
                    )
            },
        ],
    }
];