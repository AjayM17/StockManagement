import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoldingDetailsPage } from './holding-details.page';

const routes: Routes = [
  {
    path: '',
    component: HoldingDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoldingDetailsPageRoutingModule {}
