import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RiskPercentage, RiskValue, TechnicalScore, MaxRiskValue, Days, Age, RewardAbsoluteValue, RewardPercentage,RoundOff } from './custom-pipes.pipe'


@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [RiskPercentage, RiskValue, RewardAbsoluteValue,RewardPercentage, TechnicalScore, MaxRiskValue, Days,Age,RoundOff],
  exports:[RiskPercentage, RiskValue, TechnicalScore, MaxRiskValue, Days,RewardAbsoluteValue,RewardPercentage,Age,RoundOff]
})
export class CustomPipesModule {}
