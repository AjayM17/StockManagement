import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalController } from '@ionic/angular';
import { Holding } from 'src/app/modals/holding';
import { RiskAbsoluteValue, MaxRiskValue, RiskPercentage } from 'src/app/pipes/custom-pipes.pipe';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-add-holding',
  templateUrl: './add-holding.component.html',
  styleUrls: ['./add-holding.component.scss'],
})
export class AddHoldingComponent implements OnInit {

  @Input("action") action: String;
  @Input("holding") holding: Holding;

  btn_action_title = "Add"
  addForm: FormGroup
  number_regx = RegExp(/^[0-9]*$/)
  decimal_regx = RegExp(/^(\d*\.)?\d+$/)
  isFormSubmitted = false
  // initialInvestment = 10000
  initial = false
  // already_wating = true
  previousRiskValue = 0
  // previousRiskValue = 0
  btnBg = "#3880ff"
  enable = false
  maxRiskAmount = 0

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder,
    private utilService: UtilService,
    private riskAbsoluteValue: RiskAbsoluteValue,
    private firestoreService: FirestoreService,
    private maxRiskValue: MaxRiskValue,
    private riskPercentage: RiskPercentage
  ) {

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      trade_date: ['', Validators.required],
      status: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(this.number_regx)]],
      buying_price: ['', [Validators.required, Validators.pattern(this.decimal_regx)]],
      stop_loss: ['', [Validators.required, Validators.pattern(this.decimal_regx)]],
      target_price:[''],
      support_200_ema: ['',Validators.required],
      tags:['']
    })
    if (this.action == "edit") {
      this.btn_action_title = "Update"
      this.addForm.patchValue(this.holding)
    }
    this.checkStatus()
  }

  get addFormControl() {
    return this.addForm.controls;
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  checkStatus() {
    this.firestoreService.getHoldingsByName(this.addForm.controls.name.value.toUpperCase()).subscribe(res => {
      if (this.action == "edit") {
        res = res.filter(holding => holding.id != this.holding.id)
      }

      if (res.length != 0) {
        this.initial = false
        this.previousRiskValue = 0
        res.forEach(holding => {
          const val = this.riskAbsoluteValue.transform(holding.buying_price, holding.stop_loss, holding.quantity)
          this.previousRiskValue = this.previousRiskValue + Number(val)
        })
      }
      else {
        this.initial = true
      }
      this.enableAddButton()
    })
   
  }



  // calculateRiskValue(active_holdings:Holding[]){
  //   this.totalRiskValue = 0
  //   active_holdings.forEach(holding => {
  //     const val  = this.riskAbsoluteValue.transform( holding.buying_price, holding.stop_loss, holding.quantity)
  //     this.totalRiskValue = this.totalRiskValue + Number(val)
  //   })
  // }

  enableAddButton() {
    const invest =  this.addForm.controls.buying_price.value *   this.addForm.controls.quantity.value 
    let riskVal = Number(this.riskAbsoluteValue.transform(this.addFormControl.buying_price.value, this.addFormControl.stop_loss.value, this.addFormControl.quantity.value))
   
    if (riskVal < 0) {
      riskVal = Math.abs(riskVal)
      if (this.initial) {
        this.maxRiskAmount =  1000
        if (riskVal < this.maxRiskAmount) {
          this.enable = true
          this.btnBg = "#3880ff"
        } else {
          this.enable = false
          this.btnBg = "#222428"
        }
      } else {
        riskVal = Math.abs(riskVal)
        if (this.previousRiskValue <= 0) {
          this.maxRiskAmount = 1000 - Math.abs(this.previousRiskValue)
          if (riskVal < this.maxRiskAmount) {
            this.enable = true
            this.btnBg = "#3880ff"
          } else {
            this.enable = false
            this.btnBg = "#222428"
          }
        } else {
          this.maxRiskAmount = 1000
        
         
          if (riskVal <= this.previousRiskValue) {
            this.enable = true
            this.btnBg = "#3880ff"
          } else if (riskVal > this.previousRiskValue && riskVal < 1000) {
            this.enable = true
            this.btnBg = "#eb445a"
          } else {
            this.enable = false
            this.btnBg = "#222428"
          }
        }
      }
    } else {
      this.enable = true
      this.btnBg = "#3880ff"
    }
  }

  addStock() {
    this.isFormSubmitted = true
    if (this.isFormSubmitted && this.addForm.valid) {
      this.utilService.showLoading()
      if (this.action == "edit") {
        this.firestoreService.updateHolding({
          id: this.holding.id,
          name: this.addForm.controls.name.value.toUpperCase(),
          trade_date: this.addForm.controls.trade_date.value,
          status: this.addForm.controls.status.value,
          quantity: this.addForm.controls.quantity.value,
          buying_price: this.addForm.controls.buying_price.value,
          stop_loss: this.addForm.controls.stop_loss.value,
          target_price: this.addForm.controls.target_price.value,
          support_200_ema: this.addForm.controls.support_200_ema.value,
          tags: this.addForm.controls.tags.value
        }).then(res => {
          this.utilService.dismiss()
          this.utilService.presentToast("top", "Holding Updated !", "success").then(() => {
            this.utilService.presentToast("top", "Holding Updated !", "success")
            this.modalCtrl.dismiss()
          })
        }, error => {
          this.utilService.presentToast("top", "Unable to Update", "failed")
        }).catch(ex => {
          this.utilService.presentToast("top", "Unable to Update", "failed")
        })
      } else {
        this.firestoreService.addHolding({
          name: this.addForm.controls.name.value.toUpperCase(),
          trade_date: this.addForm.controls.trade_date.value,
          status: this.addForm.controls.status.value,
          quantity: this.addForm.controls.quantity.value,
          buying_price: this.addForm.controls.buying_price.value,
          stop_loss: this.addForm.controls.stop_loss.value,
          target_price: this.addForm.controls.target_price.value,
          support_200_ema: this.addForm.controls.support_200_ema.value,
          tags: this.addForm.controls.tags.value
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
