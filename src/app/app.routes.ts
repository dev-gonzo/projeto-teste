import { Routes } from '@angular/router';
import { SidebarLayoutComponent } from './core/components/sidebar-layout/sidebar-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: SidebarLayoutComponent,
        children: [
            {
                path: 'unidade-operacional',
                loadChildren: () =>
                    import('./features/unidade-operacional/unidade-operacional.routes').then(
                        (routes) => routes.routes
                    )
            }
        ]
    },
];
