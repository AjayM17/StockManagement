import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private loading: any
  constructor(private toastController: ToastController,
    private loadingController: LoadingController
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
}
