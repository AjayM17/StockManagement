import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechnicalSettingsPageRoutingModule } from './technical-settings-routing.module';

import { TechnicalSettingsPage } from './technical-settings.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TechnicalSettingsPageRoutingModule
  ],
  declarations: [TechnicalSettingsPage]
})
export class TechnicalSettingsPageModule {}
