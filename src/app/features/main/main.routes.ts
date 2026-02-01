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
        path: 'team',
        loadComponent: () => import('../team/team-list/team-list.component').then(m => m.TeamListComponent)
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('../audit-logs/audit-logs-list/audit-logs-list.component').then(m => m.AuditLogsListComponent)
      },
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full'
      }
    ]
  }
];
