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
      quantity: [1, [Validators.required, Validators.pattern(this.number_regx)]],
      buying_price: ['', [Validators.required, Validators.pattern(this.decimal_regx)]],
      time_frame: ['Daily', [Validators.required]],
      stop_loss: ['', [Validators.required, Validators.pattern(this.decimal_regx)]]
    })
    if (this.action == "edit") {
      this.btn_action_title = "Update"
      this.addForm.patchValue(this.holding)
    }
  }

  get addFormControl() {
    return this.addForm.controls;
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  disableAddButton(buy_price, stop_loss, quantity) {
    const riskAbsVal = this.riskAbsoluteValue.transform(buy_price, stop_loss, quantity)
    const riskPer = this.riskPercentage.transform(buy_price, stop_loss)
    const maxRiskVal = this.maxRiskValue.transform(riskPer)
    if (Math.abs(Number(riskAbsVal)) < Math.abs(maxRiskVal)) {
      return false
    }
    return true
  }

  addStock() {
    this.isFormSubmitted = true
    if (this.isFormSubmitted && this.addForm.valid) {
      this.utilService.showLoading()
      if (this.action == "edit") {
        this.firestoreService.updateHolding({
          id: this.holding.id,
          name: this.addForm.controls.name.value,
          quantity: this.addForm.controls.quantity.value,
          buying_price: this.addForm.controls.buying_price.value,
          time_frame: this.addForm.controls.time_frame.value,
          stop_loss: this.addForm.controls.stop_loss.value,
          tags: this.holding.tags
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
          name: this.addForm.controls.name.value,
          quantity: this.addForm.controls.quantity.value,
          buying_price: this.addForm.controls.buying_price.value,
          time_frame: this.addForm.controls.time_frame.value,
          stop_loss: this.addForm.controls.stop_loss.value,
          tags: "[]"
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
