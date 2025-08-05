import { Routes } from '@angular/router';

import { UnidadeOperacionalApiService } from '../../core/services';

import { UnidadeOperacionalListComponent } from './unidade-operacional-list/unidade-operacional-list.component';
import { UnidadeOperacionalNewComponent } from './unidade-operacional-new/unidade-operacional-new.component';
import { UnidadeOperacionalUploadComponent } from './shared/unidade-operacional-upload/unidade-operacional-upload.component';
import { UnidadeOperacionalEditComponent } from './unidade-operacional-edit/unidade-operacional-edit.component';
import { UnidadeOperacionalHistoricoComponent } from './unidade-operacional-historico/unidade-operacional-historico.component';

export const routes: Routes = [
  {
    path: 'list',
    component: UnidadeOperacionalListComponent
  },
  {
    path: 'create',
    component: UnidadeOperacionalNewComponent
  },
  {
    path: 'create-xlsx',
    component: UnidadeOperacionalUploadComponent
  },
  {
    path: 'edit/:id',
    component: UnidadeOperacionalEditComponent,
    resolve: {
      model: UnidadeOperacionalApiService,
    },
  },
  {
    path: 'historico-acoes/:id',
    component: UnidadeOperacionalHistoricoComponent
  },
  {
    path: 'historico-geral',
    component: UnidadeOperacionalHistoricoComponent
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
