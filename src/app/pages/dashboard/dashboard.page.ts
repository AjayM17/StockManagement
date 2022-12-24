import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  totalRiskVal: number = 0
  totalInvestVal: number = 0
  totalRiskPer = "0"
  constructor(private utilService: UtilService) { }

  ngOnInit() {
    this.totalRiskVal = this.utilService.getTotalRiskAmount()
    this.totalInvestVal = this.utilService.getTotalInvestment()
    this.utilService.dashboardSubject.subscribe((res) => {
      this.totalRiskVal = res['riskAmount']
      this.totalInvestVal = res['investAmount']
    })
  }

  getRiskPercentage(){
     this.totalRiskPer = ((this.totalRiskVal/this.totalInvestVal)*100).toFixed(2) + "%"
    return this.totalRiskPer
  } 
}
