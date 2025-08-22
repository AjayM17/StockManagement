import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonModal, ModalController, PopoverController, ActionSheetController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { GroupedHolding, Holding } from '../../modals/holding';
import { HoldingActionsComponent } from '../../components/holding-actions/holding-actions.component';
import { TechnicalTagsComponent } from 'src/app/components/technical-tags/technical-tags.component';
import { AddHoldingComponent } from 'src/app/components/add-holding/add-holding.component';
import { UtilService } from 'src/app/services/util/util.service';
import { RiskValue } from 'src/app/pipes/custom-pipes.pipe';
import { UserSettingsService } from 'src/app/services/user-settings/user-settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.page.html',
  styleUrls: ['./holdings.page.scss'],
})
export class HoldingsPage {
  @ViewChild(IonModal) modal: IonModal;
  segmentValue = 'active'
  holdings: Holding[] = []
  groupedHoldings = []
  // searchHolding: Holding[] = []
  selected_holding_id = null
  selling_price
  selling_modal_submit = false
  isSellingModalOpen = false
  totalRiskValue = 0
  riskPercentage: any;
  maxRiskValue: any;
  selectedStatusType: any = {
    text: 'Active',
    role: 'active',
  }
  investment = 0
  pnl_val = 0
  constructor(
    private popoverController: PopoverController,
    private actionSheetController: ActionSheetController,
    private utilService: UtilService,
    private router: Router,
    private riskValue: RiskValue,
    private userSettingsService: UserSettingsService,
    private modalCtrl: ModalController, private firestoreService: FirestoreService, private cd: ChangeDetectorRef) {
    this.getHolding()
  }

  ngOnInit() {
    // this.pnl_val = this.utilService.getTotalRiskAmount()
    // this.investment = this.utilService.getTotalInvestment()
    // this.utilService.dashboardSubject.subscribe((res) => {
    //   this.pnl_val= res['riskAmount']
    //   this.investment = res['investAmount']
    // })
  }
  getHolding() {
    this.firestoreService.getHoldings(this.selectedStatusType?.role).subscribe(res => {
      this.holdings = res;
      this.holdings = this.holdings.map((holding: any) => ({
        ...holding,
        tags: holding.tags && holding.tags !== "" ? JSON.parse(holding.tags) : []
      }));



      const groupedMap = new Map<string, GroupedHolding>();

      this.holdings.forEach((h, index) => {
        const name = String(h.name).trim();
        const quantity = Number(h.quantity);
        const price = Number(h.buying_price);
        const stop_loss = h.stop_loss;
        const type = h.type ?? 'initial';

        if (!name || isNaN(quantity) || isNaN(price)) return;

        if (!groupedMap.has(name)) {
          groupedMap.set(name, {
            name,
            buying_price: 0,
            stop_loss: null,
            quantity: 0,
            investment: 0,
            breakdowns: [],
            showBreakdown: false,
            tags: [],
            _fallbackSet: false  // 🔸 internal flag to set fallback only once
          });
        }

        const group = groupedMap.get(name)!;

        // Add to totals
        group.quantity += quantity;
        group.investment += quantity * price;

        // Add this item to breakdowns
        group.breakdowns.push(h);

        // If type is 'initial', set stop_loss and tags (override any previous value)
        if (type === 'initial') {
          group.stop_loss = stop_loss;
          group.tags = h.tags || [];
          group._fallbackSet = true; // prevent fallback from overwriting this
        } else if (!group._fallbackSet) {
          // If no 'initial' yet, set from first element (fallback)
          group.stop_loss = stop_loss;
          group.tags = h.tags || [];
          group._fallbackSet = true;
        }
      });


      // Calculate avg_buy for each group
      groupedMap.forEach(group => {
        group.buying_price = parseFloat((group.investment / group.quantity).toFixed(2));
      });

      // Convert Map to Array if needed
      this.groupedHoldings = Array.from(groupedMap.values());
      // this.searchHolding = this.groupedHoldings;
      this.utilService.updateHoldingCountOnTabs(this.groupedHoldings.length);
      this.cd.detectChanges();
      // this.getTotalRiskValue()
      this.getTotalRiskAmount()

    })
  }

  getPnlPer() {
    return ((this.pnl_val / this.investment) * 100).toFixed(2) + "%"
  }

  getTotalRiskAmount() {
    // let riskamount = 0
    // let investAmount = 0

    this.pnl_val = 0
    this.investment = 0
    this.holdings.forEach(holding => {

      // if(holding.status == "active"){
      this.pnl_val = this.pnl_val + Number(this.riskValue.transform(holding.buying_price, holding.stop_loss, holding.quantity))
      this.investment = this.investment + holding.buying_price * holding.quantity
      // }  
    })
    // this.utilService.setTotalRiskAmount(riskamount)
    // this.utilService.setTotalInvestment(investAmount)
  }

  search(event) {
    const query = event.target.value.toLowerCase();
    // this.searchHolding = this.holdings.filter(holding => holding.name.toLowerCase().includes(query));
  }

  getTotalRiskValue() {
    this.totalRiskValue = 0
    this.holdings.forEach(holding => {
      this.totalRiskValue = this.totalRiskValue + Number(this.riskValue.transform(holding.buying_price, holding.stop_loss, holding.quantity))
    })
  }

  addHolding(action) {
    if (this.groupedHoldings.length < this.userSettingsService.user_settings?.max_holding_limit || this.selectedStatusType?.role == 'waiting')
      this.presentAddHoldingModal(action)
    else
      this.utilService.presentToast("top", "You have reached limit for new trade !", "failed")
  }

  async presentAddHoldingModal(action, holding = {}, groupHolding = {}) {
    // if(action == 'add_more' || action == 'edit' || this.holdings.length < this.userSettingsService.user_settings?.max_holding_limit){
    const modal = await this.modalCtrl.create({
      component: AddHoldingComponent,
      componentProps: { action: action, holding: holding, groupHolding: groupHolding, status: this.selectedStatusType.role }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    // } else {
    //   this.utilService.presentToast("top", "You have reached limit for new trade !", "failed")
    // }

  }

  async addTechnicalTags(holding = {}) {
    const modal = await this.modalCtrl.create({
      component: TechnicalTagsComponent,
      componentProps: { holding: holding }
    });
    modal.present();
  }

  showTags(id) {
    const holding = this.holdings.find(holding => holding.id == id)
    this.addTechnicalTags(holding)
  }

  async filterActions() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'All',
          role: 'All',
          data: { text: 'All' }
        },
        {
          text: 'Active',
          role: 'active',
          data: { text: 'Active' }
        },
        {
          text: 'Waiting',
          role: 'waiting',
          data: { text: 'Waiting' }
        },
        {
          text: 'Completed',
          role: 'completed',
          data: { text: 'Completed' }
        }
      ]
    });

    await actionSheet.present()
    const { data, role } = await actionSheet.onDidDismiss();
    this.selectedStatusType = {
      role,
      text: data?.text || null
    }
    if (role != "backdrop") {
      this.getHolding()
    }

    // const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)
    // switch (role) {
    //   case "name":
    //     // this.addTechnicalTags(holding)
    //     break;
    //   case "riskvalue":
    //     // this.addHolding('edit', holding)
    //     break;

    //   case "age":
    //     // this.firestoreService.deleteHolding(holding.id)
    //     break;
    // }
  }

  async sortActions() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'A-Z',
          role: 'name',
          data: {
            action: 'name',
          },
        },
        {
          text: 'Risk Value',
          role: 'riskvalue',
          data: {
            action: 'riskvalue',
          }
        },
        {
          text: 'Age',
          role: 'age',
          data: {
            action: 'age',
          }
        }
      ],
    });

    await actionSheet.present()
    const { role } = await actionSheet.onDidDismiss();
    const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)
    switch (role) {
      case "name":
        // this.addTechnicalTags(holding)
        break;
      case "riskvalue":
        // this.addHolding('edit', holding)
        break;

      case "age":
        // this.firestoreService.deleteHolding(holding.id)
        break;
    }
  }

  toggleBreakdown(index: number) {
    this.groupedHoldings.forEach((h, i) => {
      h.showBreakdown = i === index ? !h.showBreakdown : false;
    });
  }

  segmentChanged() {

  }

  async actions(id, groupHoldingIndex, actionFor = 'holding') {
    console.log(actionFor)
    let buttons = []
    if (actionFor == 'holding') {
      buttons = [
        {
          text: 'Add More',
          role: 'add_more',
          data: {
            action: 'add_more',
          },
        },
        {
          text: 'Edit',
          role: 'edit',
          data: {
            action: 'edit',
          },
        },
        {
          text: 'Details',
          role: 'details',
          data: {
            action: 'details',
          },
        },
        {
          text: 'Add Tags',
          role: 'open-technical-tag',
          data: {
            action: 'open-technical-tag',
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
      ]
    } else {
      buttons = [
        {
          text: 'Add More',
          role: 'add_more',
          data: {
            action: 'add_more',
          },
        },

        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    }
    const actionSheet = await this.actionSheetController.create({
      buttons: buttons,
    });

    await actionSheet.present().then(() => {
      this.selected_holding_id = id
    })
    const { role, data } = await actionSheet.onDidDismiss();
    const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)
    const groupHolding = this.groupedHoldings[groupHoldingIndex]
    switch (role) {
      case "add_more":
        // if (Number(groupHolding.stop_loss) > Number(groupHolding.buying_price)) {
        this.presentAddHoldingModal('add_more', {}, groupHolding)
        // } else {
        // this.utilService.presentToast("top", "Can't add more P&L is in negative", "failed")
        // }
        break;
      case "open-technical-tag":
        this.addTechnicalTags(holding)
        break;
      case "edit":
        this.presentAddHoldingModal('edit', holding, groupHolding)
        break;
      // case "exit-holding":
      //   this.showSellingPriceModal()
      //   break;
      case "delete":
        this.firestoreService.deleteHolding(holding.id)
        break;

      case "completed":
        this.firestoreService.updateHoldingStatus(holding.id, "completed");
        break;
      case "details":
        console.log(groupHolding)
        this.router.navigate(['/holding-details'], {
          state: { data: holding }
        });
        break;
    }
    // this.result = JSON.stringify(result, null, 2);
  }

  // async actions1(e: Event, id) {
  //   const popover = await this.popoverController.create({
  //     component: HoldingActionsComponent,
  //     event: e
  //   });

  //   await popover.present().then(() => {
  //     this.selected_holding_id = id
  //   })

  //   const { role, data } = await popover.onDidDismiss();
  //   const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)
  //   switch (role) {
  //     case "open-technical-tag":
  //       this.addTechnicalTags(holding)
  //       break;
  //     case "edit-holding":
  //       this.addHolding('edit', holding)
  //       break;
  //     case "exit-holding":
  //       this.showSellingPriceModal()
  //       break;
  //     case "delete-holding":
  //       this.firestoreService.deleteHolding(holding.id)
  //       break;
  //   }

  // }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  showSellingPriceModal() {

    this.isSellingModalOpen = true
    // if(this.selling_price != ""){
    //   this.firestoreService.addWatchist({
    //     name:this.name
    //   })
    // }

    this.modal.dismiss(null, 'save');
  }

  addToHistory() {
    this.selling_modal_submit = true
    // if(this.selling_price > 0){
    this.isSellingModalOpen = false
    this.utilService.showLoading()
    const holding = this.holdings.find(holding => holding.id == this.selected_holding_id)

    this.firestoreService.addToHistory(holding).then(res => {
      this.firestoreService.deleteHolding(holding.id)
      this.utilService.dismiss()
      this.selling_price = 0
      this.utilService.presentToast("top", "Holding added to history !", "success")
    })
    // }
  }


  isInProfit(buy_price, stop_loss, quantity) {
    const riskAbsVal = Number(this.riskValue.transform(buy_price, stop_loss, quantity))
    if (riskAbsVal < 1) {
      return false
    }
    return true
  }

  onWillDismiss(event: Event) {
  }

}
