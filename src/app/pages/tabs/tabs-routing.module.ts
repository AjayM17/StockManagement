import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'holdings',
        children: [
          {
            path: '',
            loadChildren: () => import('../holdings/holdings.module').then( m => m.HoldingsPageModule)
          }
        ]
      },
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
          }
        ]
      },
      {
        path: 'favourite',
        children: [
          {
            path: '',
            loadChildren: () => import('../favourite/favourite.module').then( m => m.FavouritePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'holdings',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
