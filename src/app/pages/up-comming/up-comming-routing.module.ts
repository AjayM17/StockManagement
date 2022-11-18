import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpCommingPage } from './up-comming.page';

const routes: Routes = [
  {
    path: '',
    component: UpCommingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpCommingPageRoutingModule {}
