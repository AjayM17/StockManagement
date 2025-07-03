import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

 private countSubject = new BehaviorSubject<any>(null);
  public count$ = this.countSubject.asObservable();
  investAmount = 0
  riskAmount = 0
  private loading: any
  dashboardSubject = new Subject()
  constructor(private toastController: ToastController,
    private loadingController: LoadingController,
    ) {
   }

   async presentToast(position: 'top' | 'middle' | 'bottom', message, status: 'success' | 'failed') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      color: status == 'success' ? 'success' : 'danger'
    });

    await toast.present();
  }

  async showLoading(message:String= "") {
     this.loading = await this.loadingController.create({
      message: '',
    });

    this.loading.present();
  }

  dismiss(){
    this.loading.dismiss()
  }


  setTotalRiskAmount(amount){
    this.riskAmount = amount
    this.dashboardSubject.next({
      "riskAmount":this.riskAmount,
      "investAmount": this.investAmount
    })
  }

  getTotalRiskAmount(){
    return this.riskAmount
  }

  setTotalInvestment(amount){
    this.investAmount = amount
    this.dashboardSubject.next({
      "riskAmount":this.riskAmount,
      "investAmount": this.investAmount
    })
  }

  getTotalInvestment(){
    return this.investAmount
  }

  updateHoldingCountOnTabs(count:any){
    this.countSubject.next(count)
  }
}
