import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { TicketsListComponent } from '../tickets/tickets-list/tickets-list.component';

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'tickets',
        component: TicketsListComponent
      },
      {
        path: 'clients',
        loadComponent: () => import('../clients/clients-list/clients-list.component').then(m => m.ClientsListComponent)
      },
      {
        path: 'contractors',
        loadComponent: () => import('../contractors/contractors-list/contractors-list.component').then(m => m.ContractorsListComponent)
      },
      {
        path: 'team',
        loadComponent: () => import('../team/team-list/team-list.component').then(m => m.TeamListComponent)
      },
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full'
      }
    ]
  }
];
