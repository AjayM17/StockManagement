import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'tabs',
  //   pathMatch: 'full'
  // },
  {
    path: 'up-comming',
    loadChildren: () => import('./pages/up-comming/up-comming.module').then( m => m.UpCommingPageModule)
  },
  {
    path: 'technical-settings',
    loadChildren: () => import('./pages/technical-settings/technical-settings.module').then( m => m.TechnicalSettingsPageModule)
  },
  {
    path: 'holdings',
    loadChildren: () => import('./pages/holdings/holdings.module').then( m => m.HoldingsPageModule)
  },
  {
    path: 'watchlist',
    loadChildren: () => import('./pages/watchlist/watchlist.module').then( m => m.WatchlistPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'favourite',
    loadChildren: () => import('./pages/favourite/favourite.module').then( m => m.FavouritePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'stock-details/:id',
    loadChildren: () => import('./pages/stock-details/stock-details.module').then( m => m.StockDetailsPageModule)
  },  {
    path: 'holding-details',
    loadChildren: () => import('./pages/holding-details/holding-details.module').then( m => m.HoldingDetailsPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
