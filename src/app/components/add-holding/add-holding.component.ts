import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalController } from '@ionic/angular';
import { GroupedHolding, Holding } from 'src/app/modals/holding';
import { RiskValue, MaxRiskValue, RiskPercentage } from 'src/app/pipes/custom-pipes.pipe';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UserSettingsService } from 'src/app/services/user-settings/user-settings.service';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-add-holding',
  templateUrl: './add-holding.component.html',
  styleUrls: ['./add-holding.component.scss'],
})
export class AddHoldingComponent implements OnInit {

  @Input("action") action: String;
  @Input("holding") holding: Holding;
  @Input("holding") groupHolding: GroupedHolding;
  @Input("status") status: Holding;


  btn_action_title = "Add New"
  addForm: FormGroup
  number_regx = RegExp(/^[0-9]*$/)
  decimal_regx = RegExp(/^(\d*\.)?\d+$/)
  isFormSubmitted = false
  // initialInvestment = 10000
  // initial = false
  // already_wating = true
  previousRiskValue = 0
  // previousRiskValue = 0
  btnBg = "#3880ff"
  enable = true;
  max_risk_value = 0
  // selectedRisk: string = '25'; // default selected option
  // calculatedRisk: number = 0;
  riskOptions = [
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
    // { label: '5000', value: '5000' }
  ];

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder,
    private utilService: UtilService,
    private riskValue: RiskValue,
    private firestoreService: FirestoreService,
    public userSettingsService: UserSettingsService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      trade_date: [''],
      selectedRisk: ['50'],
      status: [''],
      quantity: [1, [Validators.required, Validators.pattern(this.number_regx)]],
      buying_price: ['', [Validators.required, Validators.pattern(this.decimal_regx)]],
      stop_loss: ['', [Validators.required, Validators.pattern(this.decimal_regx)]],
      support_time_frame: ['W', Validators.required],
      support_ema: ['50 EMA', Validators.required],
      // target_price: [''],
      // support_200_ema: ['', Validators.required],
      // tags: ['']
    })

    // Disable fields if action is 'add_more' or holding type is 'add_more'
    if (this.action === 'add_more' || this.holding.type === 'add_more') {
      this.addForm.get('name')?.disable();
      this.addForm.get('stop_loss')?.disable();
    }

    // Push risk option
    const maxSlAmount = Number(this.userSettingsService.user_settings?.max_sl_amount ?? 0);
    this.riskOptions.push({ label: (maxSlAmount/2).toString(), value: (maxSlAmount/2).toString() });
    console.log(this.riskOptions)

    // Handle form based on action
    switch (this.action) {
      case 'edit':
        this.btn_action_title = 'Update';
        this.addForm.patchValue(this.holding);
        if (this.groupHolding?.breakdowns?.length > 1) {
          this.calculateRisk();
        } else {
          this.max_risk_value = Math.abs(maxSlAmount);
        }
        break;

      case 'add_more':
        this.btn_action_title = 'Add More';
        this.addForm.patchValue({
          name: this.groupHolding?.name,
          stop_loss: this.groupHolding?.stop_loss,
          type: 'add_more'
        });
        this.calculateRisk();
        break;

      default:
        this.addForm.patchValue({ type: 'initial' });
        this.max_risk_value = Math.abs(maxSlAmount);
        break;
    }

    // Set status and enable button
    this.addForm.patchValue({ status: this.status });
    this.enableAddButton();

  }

  get addFormControl() {
    return this.addForm.controls;
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  // checkStatus() {
  //   this.firestoreService.getHoldingsByName(this.addForm.controls.name.value.toUpperCase()).subscribe(res => {
  //     if (this.action == "edit") {
  //       res = res.filter(holding => holding.id != this.holding.id)
  //     }

  //     if (res.length != 0) {
  //       this.initial = false
  //       this.previousRiskValue = 0
  //       res.forEach(holding => {
  //         const val = this.riskValue.transform(holding.buying_price, holding.stop_loss, holding.quantity)
  //         this.previousRiskValue = this.previousRiskValue + Number(val)
  //       })
  //     }
  //     else {
  //       this.initial = true
  //     }
  //     // this.enableAddButton()
  //   })

  // }



  // calculateRiskValue(active_holdings:Holding[]){
  //   this.totalRiskValue = 0
  //   active_holdings.forEach(holding => {
  //     const val  = this.riskValue.transform( holding.buying_price, holding.stop_loss, holding.quantity)
  //     this.totalRiskValue = this.totalRiskValue + Number(val)
  //   })
  // }

  enableAddButton() {
    if (this.addForm.controls.buying_price.value < 1 || this.addForm.controls.stop_loss.value < 1 || this.addForm.controls.quantity.value < 1) {
      this.enable = false
      this.btnBg = "#eb445a"
      return
    }


    const invest = this.addForm.controls.buying_price.value * this.addForm.controls.quantity.value
    const riskVal =this.riskValue.transform(this.addFormControl.buying_price.value, this.addFormControl.stop_loss.value, this.addFormControl.quantity.value)
    if(riskVal > 0){
      this.enable = true
      this.btnBg = "#3880ff"
      return
    }
    if ((invest <= this.userSettingsService.user_settings.max_trade_amount || this.action == 'add_more') &&  Math.abs(riskVal) <= this.max_risk_value) {
      this.enable = true
      this.btnBg = "#3880ff"
    } else {
      this.enable = false
      this.btnBg = "#eb445a"
    }
  }

  calculateRisk() {
    const val = this.addForm.get('selectedRisk')?.value;
    const pl = (this.groupHolding.stop_loss - this.groupHolding.buying_price) * this.groupHolding.quantity
    if (pl > 0) {
       const maxSlAmount = Number(this.userSettingsService.user_settings?.max_sl_amount ?? 0);
      if (val == maxSlAmount/2) {
        this.max_risk_value = maxSlAmount/2;
      } else {
        const percentage = Number(val);
        this.max_risk_value = (Math.abs((this.groupHolding.stop_loss - this.groupHolding.buying_price) * this.groupHolding.quantity) * percentage) / 100;
      }
    } else {
      this.max_risk_value = Math.abs(this.userSettingsService.user_settings.max_sl_amount) + pl
    }
    this.enableAddButton()
    this.cdr.detectChanges();

  }

  addStock() {
    this.isFormSubmitted = true
    console.log(this.addForm.controls)
    if (this.isFormSubmitted && this.addForm.valid) {
      this.utilService.showLoading()
      if (this.action == "edit") {
        this.firestoreService.updateHolding({
          id: this.holding.id,
          name: this.addForm.controls.name.value.toUpperCase(),
          type: this.addForm.controls.type.value,
          trade_date: this.addForm.controls.trade_date.value,
          status: this.addForm.controls.status.value,
          quantity: this.addForm.controls.quantity.value,
          buying_price: this.addForm.controls.buying_price.value,
          stop_loss: this.addForm.controls.stop_loss.value,
          support_time_frame: this.addForm.controls.support_time_frame.value,
          support_ema: this.addForm.controls.support_ema.value,
          // target_price: this.addForm.controls.target_price.value,
          // support_200_ema: this.addForm.controls.support_200_ema.value,
          // tags: this.addForm.controls.tags.value
        }).then(res => {
          this.utilService.dismiss()
          this.utilService.presentToast("top", "Holding Updated !", "success").then(() => {
            this.modalCtrl.dismiss()
          })
        }, error => {
          this.utilService.presentToast("top", "Unable to Update", "failed")
        }).catch(ex => {
          this.utilService.presentToast("top", "Unable to Update", "failed")
        })
        if (this.holding.stop_loss != this.addForm.controls.stop_loss.value)
          this.firestoreService.updateStopLoss(this.addForm.controls.name.value.toUpperCase(), this.addForm.controls.stop_loss.value)
      } else {
        this.firestoreService.addHolding({
          name: this.addForm.controls.name.value.toUpperCase(),
          type: this.addForm.controls.type.value,
          trade_date: this.addForm.controls.trade_date.value,
          status: this.addForm.controls.status.value,
          quantity: this.addForm.controls.quantity.value,
          buying_price: this.addForm.controls.buying_price.value,
          stop_loss: this.addForm.controls.stop_loss.value,
          support_time_frame: this.addForm.controls.support_time_frame.value,
          support_ema: this.addForm.controls.support_ema.value,
          // target_price: this.addForm.controls.target_price.value,
          // support_200_ema: this.addForm.controls.support_200_ema.value,
          // tags: this.addForm.controls.tags.value
        }).then(res => {
          this.utilService.dismiss()
          this.utilService.presentToast("top", "Holding Added !", "success").then(() => {
            this.utilService.presentToast("top", "Holding Added !", "success")
            this.modalCtrl.dismiss()
          })
        }, error => {
          this.utilService.presentToast("top", "Unable to Add", "failed")
        }).catch(ex => {
          this.utilService.presentToast("top", "Unable to Add", "failed")
        })
      }

    }
  }
}
