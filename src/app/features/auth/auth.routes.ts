import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';


export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import(`./login/login.component`)
                    .then(mod => mod.LoginComponent)
            }, 
            {
                path: 'cadastro',
                loadComponent: () => import(`./cadastro/cadastro.component`)
                    .then(mod => mod.CadastroComponent)
            }, 
            {
                path: 'create-password',
                loadComponent: () => import(`./create-password/create-password.component`)
                    .then(mod => mod.CreatePasswordComponent)
            },
            {
                path: 'validar-token',
                loadComponent: () => import(`./validate-token/validate-token.component`)
                    .then(mod => mod.ValidateTokenComponent)
            },
            {
                path: 'recuperar-senha',
                loadComponent: () => import(`./recover-pass/recover-pass.component`)
                    .then(mod => mod.RecoverPassComponent)
            },

            {
                path: '**',
                loadComponent: () => import(`./login/login.component`)
                    .then(mod => mod.LoginComponent)
            },

        ]
    },
];