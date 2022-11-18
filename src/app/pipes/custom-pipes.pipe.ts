import { Pipe, PipeTransform } from '@angular/core';
import TechnicalTags from '../../assets/local_json/technical_tags.json';


@Pipe({
  name: 'maxRiskValue'
})

export class MaxRiskValue implements PipeTransform {
  transform(risk_per:string): number {
    const risk_per_abs = Math.abs(Number(risk_per))
    let maxRiskAmount = 0
    if(risk_per_abs <= 3){
      maxRiskAmount = 4000
    } else if(risk_per_abs > 3 && risk_per_abs < 5){
      maxRiskAmount = 3000
    } else if(risk_per_abs > 5 && risk_per_abs < 10){
      maxRiskAmount = 2000
    } else if(risk_per_abs > 10 && risk_per_abs < 15){
      maxRiskAmount = 1000
    } else {
      maxRiskAmount = 500
    }
    const one_per_of_max_amount = maxRiskAmount/100
    const maxriskvalue =  maxRiskAmount - (Number(risk_per) * one_per_of_max_amount)
    return -maxriskvalue
  }
    
}

@Pipe({
  name: 'riskPercentage'
})
export class RiskPercentage implements PipeTransform {
  transform(buy_price:number = 0, stop_loss: number = 0): string {
    return (((stop_loss - buy_price )/buy_price)*100).toFixed(2)
  }
}

@Pipe({
  name: 'riskAbsoluteValue'
})
export class RiskAbsoluteValue implements PipeTransform {
  transform(buy_price:number = 0, stop_loss: number = 0, quantity = 0): string {
    return ((stop_loss - buy_price)* quantity).toFixed(2)
  }
}


@Pipe({
  name: 'technicalScore'
})
export class TechnicalScore implements PipeTransform {
   max_score =  TechnicalTags["max_score"]
   score = 0
  transform(tag: String):string {
    const tags = JSON.parse(tag.toString())
    tags.forEach(tag => {
    this.score +=  tag.value
    })
    return (((this.score/this.max_score)*100).toFixed(2) + "%")
  }
}
