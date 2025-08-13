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
    {
        path: 'erro',
        loadComponent: () => import(`./shared/components/erro/erro.component`)
            .then(mod => mod.ErroComponent)
    },
    {
        path: 'nao-autorizado',
        loadComponent: () => import(`./shared/components/nao-autorizado/nao-autorizado.component`)
            .then(mod => mod.NaoAutorizadoComponent)
    },
    {
        path: '**',
        loadComponent: () => import(`./shared/components/nao-encontrada/nao-encontrada.component`)
            .then(mod => mod.NaoEncontradaComponent)
    },
];
