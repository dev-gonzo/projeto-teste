import { Routes } from '@angular/router';
import { SidebarLayoutComponent } from './core/components/sidebar-layout/sidebar-layout.component';
import { HomePageComponent } from './features/home/home.component';
import { AuthGuardService } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: '',
        component: SidebarLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomePageComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'unidade-operacional',
                loadChildren: () =>
                    import('./features/unidade-operacional/unidade-operacional.routes').then(
                        (routes) => routes.routes
                    ),
                canActivate: [AuthGuardService],
            },
        ],
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((routes) => routes.routes),
    },
];