import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RiskPercentage, RiskAbsoluteValue, TechnicalScore, MaxRiskValue, Days, RewardAbsoluteValue, RewardPercentage } from './custom-pipes.pipe'


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [RiskPercentage, RiskAbsoluteValue, RewardAbsoluteValue,RewardPercentage, TechnicalScore, MaxRiskValue, Days,],
  exports:[RiskPercentage, RiskAbsoluteValue, TechnicalScore, MaxRiskValue, Days,RewardAbsoluteValue,RewardPercentage]
})
export class CustomPipesModule {}
