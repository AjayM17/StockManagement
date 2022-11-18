import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpCommingPageRoutingModule } from './up-comming-routing.module';

import { UpCommingPage } from './up-comming.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpCommingPageRoutingModule
  ],
  declarations: [UpCommingPage]
})
export class UpCommingPageModule {}
