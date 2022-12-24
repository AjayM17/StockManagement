import { Pipe, PipeTransform } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import TechnicalTags from '../../assets/local_json/technical_tags.json';


@Pipe({
  name: 'maxRiskValue'
})

export class MaxRiskValue implements PipeTransform {
  transform(risk_per: string): number {
    const risk_per_innumber = Number(risk_per)
    if (risk_per_innumber < 1) {
      const risk_per_abs = Math.abs(risk_per_innumber)
      let maxRiskAmount = 0
      if (risk_per_abs <= 3) {
        maxRiskAmount = 4000
      } else if (risk_per_abs > 3 && risk_per_abs < 5) {
        maxRiskAmount = 3000
      } else if (risk_per_abs > 5 && risk_per_abs < 10) {
        maxRiskAmount = 2000
      } else if (risk_per_abs > 10 && risk_per_abs < 15) {
        maxRiskAmount = 1000
      } else {
        maxRiskAmount = 500
      }
      const one_per_of_max_amount = maxRiskAmount / 100
      const maxriskvalue = maxRiskAmount - (Number(risk_per_abs) * one_per_of_max_amount)
      return -maxriskvalue
    } else {
      return
    }

  }

}

@Pipe({
  name: 'rewardPercentage'
})
export class RewardPercentage implements PipeTransform {
  transform(buy_price: number = 0, target_price: number = 0): string {
    return (((target_price - buy_price) / buy_price) * 100).toFixed(2)
  }
}

@Pipe({
  name: 'rewardAbsoluteValue'
})
export class RewardAbsoluteValue implements PipeTransform {
  transform(buy_price: number = 0, target_price: number = 0, quantity = 0): string {
    return ((target_price - buy_price) * quantity).toFixed(2)
  }
}

@Pipe({
  name: 'riskPercentage'
})
export class RiskPercentage implements PipeTransform {
  transform(buy_price: number = 0, stop_loss: number = 0): string {
    return (((stop_loss - buy_price) / buy_price) * 100).toFixed(2)
  }
}

@Pipe({
  name: 'riskAbsoluteValue'
})
export class RiskAbsoluteValue implements PipeTransform {
  transform(buy_price: number = 0, stop_loss: number = 0, quantity = 0): string {
    return ((stop_loss - buy_price) * quantity).toFixed(2)
  }
}


@Pipe({
  name: 'technicalScore'
})
export class TechnicalScore implements PipeTransform {
  max_score = TechnicalTags["max_score"]
  score = 0
  transform(tag: string): string {
    const tags = JSON.parse(tag.toString())
    tags.forEach(tag => {
      this.score += tag.value
    })
    return (((this.score / this.max_score) * 100).toFixed(2) + "%")
  }
}


@Pipe({
  name: 'days'
})
export class Days implements PipeTransform {
  transform(date: String): number {
    if (date != undefined) {
      const date_arr = date.split("-")
      const date_str = date_arr[1] + "/" + date_arr[2] + "/" + date_arr[0]
      const date1 = new Date(date_str)
      const today_date = new Date().toLocaleDateString()
      const today_date_arr = today_date.split("/")
      const today_date_str = today_date_arr[1] + "/" + today_date_arr[0] + "/" + today_date_arr[2]
      const date2 = new Date(today_date_str)
      const Difference_In_Time = date2.getTime() - date1.getTime();
      const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      return Difference_In_Days
    }

  }
}



