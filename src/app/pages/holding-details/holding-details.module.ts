import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HoldingDetailsPageRoutingModule } from './holding-details-routing.module';

import { HoldingDetailsPage } from './holding-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HoldingDetailsPageRoutingModule
  ],
  declarations: [HoldingDetailsPage]
})
export class HoldingDetailsPageModule {}
