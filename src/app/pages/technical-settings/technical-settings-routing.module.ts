import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechnicalSettingsPage } from './technical-settings.page';

const routes: Routes = [
  {
    path: '',
    component: TechnicalSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicalSettingsPageRoutingModule {}
