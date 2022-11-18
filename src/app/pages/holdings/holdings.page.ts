import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonModal, ModalController, PopoverController,ActionSheetController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Holding } from '../../modals/holding';
import { HoldingActionsComponent } from '../../components/holding-actions/holding-actions.component';
import { TechnicalTagsComponent } from 'src/app/components/technical-tags/technical-tags.component';
import { AddHoldingComponent } from 'src/app/components/add-holding/add-holding.component';
import { UtilService } from 'src/app/services/util/util.service';
import { RiskAbsoluteValue } from 'src/app/pipes/custom-pipes.pipe';


@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.page.html',
  styleUrls: ['./holdings.page.scss'],
})
export class HoldingsPage {
  @ViewChild(IonModal) modal: IonModal;
  holdings: Holding[] = []
  selected_holding_id = null
  selling_price
  selling_modal_submit = false
  isSellingModalOpen = false
  totalRiskValue = 0
  constructor(
    private popoverController: PopoverController,
    private actionSheetController: ActionSheetController,
    private utilService: UtilService,
    private riskAbsoluteValue: RiskAbsoluteValue,
    private modalCtrl: ModalController, private firestoreService: FirestoreService, private cd: ChangeDetectorRef) {
    this.getHolding()
  }

  getHolding() {
    this.firestoreService.getHoldings().subscribe(res => {
      this.holdings = res
      this.cd.detectChanges();
      this.getTotalRiskValue()
    })
  }

  getTotalRiskValue(){
    this.totalRiskValue = 0
   this.holdings.forEach(holding => {
      this.totalRiskValue = this.totalRiskValue +  Number(this.riskAbsoluteValue.transform(holding.buying_price,holding.stop_loss,holding.quantity))
    })
  }

  async addHolding(action, holding={}) {
    const modal = await this.modalCtrl.create({
      component: AddHoldingComponent,
      componentProps:{action:action,holding:holding}
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  async addTechnicalTags(holding={}) {
    const modal = await this.modalCtrl.create({
      component: TechnicalTagsComponent,
      componentProps: {holding:holding}
    });
    modal.present();
  }

  showTags(id){
    const holding = this.holdings.find(holding => holding.id == id)
    this.addTechnicalTags(holding)
  }

  async actions(id) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Edit',
          role: 'edit',
          data: {
            action: 'edit',
          },
        },
        {
          text: 'Completed',
          role: 'completed',
          data: {
            action: 'completed',
          },
        },
        {
          text: 'Delete',
          role: 'delete',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present().then(() => {
      this.selected_holding_id = id
    })

    // const result = await actionSheet.onDidDismiss();
    // console.log(result)
    const { role, data } = await actionSheet.onDidDismiss();
    console.log(role)
    const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)
    switch(role){
      case "open-technical-tag":
        this.addTechnicalTags(holding)
        break;
      case "edit":
      this.addHolding('edit',holding)
      break;
      // case "exit-holding":
      //   this.showSellingPriceModal()
      //   break;
        case "delete":
          this.firestoreService.deleteHolding(holding.id)
          break;
    }
    // this.result = JSON.stringify(result, null, 2);
  }

  async actions1(e: Event,id) {
    const popover = await this.popoverController.create({
      component: HoldingActionsComponent,
      event: e
    });

    await popover.present().then(() => {
      this.selected_holding_id = id
    })

    const { role, data } = await popover.onDidDismiss();
    const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)
    switch(role){
      case "open-technical-tag":
        this.addTechnicalTags(holding)
        break;
      case "edit-holding":
      this.addHolding('edit',holding)
      break;
      case "exit-holding":
        this.showSellingPriceModal()
        break;
        case "delete-holding":
          this.firestoreService.deleteHolding(holding.id)
          break;
    }

  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  showSellingPriceModal(){

    this.isSellingModalOpen = true
    // if(this.selling_price != ""){
    //   this.firestoreService.addWatchist({
    //     name:this.name
    //   })
    // }

    this.modal.dismiss(null, 'save');
  }

  addToHistory(){
    this.selling_modal_submit = true
    // if(this.selling_price > 0){
      this.isSellingModalOpen = false
      this.utilService.showLoading()
      const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)
      holding.selling_price = this.selling_price
      this.firestoreService.addToHistory(holding).then( res => {
        this.firestoreService.deleteHolding(holding.id)
        this.utilService.dismiss()
        this.selling_price = 0
        this.utilService.presentToast("top", "Holding added to history !", "success")
      })
    // }
  }
  
  onWillDismiss(event: Event) {
  }

}
