import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoldingsPage } from './holdings.page';

const routes: Routes = [
  {
    path: '',
    component: HoldingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoldingsPageRoutingModule {}
