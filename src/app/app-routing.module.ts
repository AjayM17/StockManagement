import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'holdings',
    pathMatch: 'full'
  },
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
