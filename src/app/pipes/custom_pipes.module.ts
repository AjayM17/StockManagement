import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RiskPercentage, RiskAbsoluteValue, TechnicalScore, MaxRiskValue } from './custom-pipes.pipe'


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [RiskPercentage, RiskAbsoluteValue, TechnicalScore, MaxRiskValue],
  exports:[RiskPercentage, RiskAbsoluteValue, TechnicalScore, MaxRiskValue]
})
export class CustomPipesModule {}
