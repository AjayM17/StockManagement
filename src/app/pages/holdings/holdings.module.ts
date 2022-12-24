import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HoldingsPageRoutingModule } from './holdings-routing.module';

import { HoldingsPage } from './holdings.page';
import { CustomPipesModule } from '../../pipes/custom_pipes.module'
// import { AddStockComponent } from "../../components/add-stock/add-stock.component";
import { TechnicalTagsComponent } from 'src/app/components/technical-tags/technical-tags.component';
import { AddHoldingComponent } from 'src/app/components/add-holding/add-holding.component';
import { HoldingActionsComponent } from 'src/app/components/holding-actions/holding-actions.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HoldingsPageRoutingModule,
    CustomPipesModule,
    ReactiveFormsModule
  ],
  declarations: [HoldingsPage,
    HoldingActionsComponent,
    AddHoldingComponent,TechnicalTagsComponent]
})
export class HoldingsPageModule {}
