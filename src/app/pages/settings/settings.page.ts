import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UserSettingsService } from 'src/app/services/user-settings/user-settings.service';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  settingsForm: FormGroup
  isFormSubmitted = false
  btn_action_title = "Save"
  // enableSubmit = true
  // user_settings_id = null
  constructor(private formBuilder: FormBuilder,
    private utilService: UtilService,
    private firestoreService: FirestoreService,
    private userSettingsService: UserSettingsService
  ) { }

  ngOnInit() {
    this.settingsForm = this.formBuilder.group({
      capital: ['', Validators.required],
      max_sl_amount: ['', Validators.required],
      max_trade_amount: ['', Validators.required],
      max_holding_limit: ['', Validators.required],
    })

  
  }

  ionViewWillEnter() {
    if(this.userSettingsService.user_settings_id){
      this.settingsForm.patchValue(this.userSettingsService.user_settings)
      this.btn_action_title = 'Update'
    }
  }

  get settingsFormControl() {
    return this.settingsForm.controls;
  }

  saveSettings() {
    this.isFormSubmitted = true
    if (this.isFormSubmitted && this.settingsForm.valid) {
      this.utilService.showLoading()
      if (!this.userSettingsService.user_settings_id) {
        this.firestoreService.setUserSettings({
          capital: this.settingsForm.controls.capital.value,
          max_sl_amount: this.settingsForm.controls.max_sl_amount.value,
          max_trade_amount: this.settingsForm.controls.max_trade_amount.value,
          max_holding_limit: this.settingsForm.controls.max_holding_limit.value,
        }).then(res => {
          this.utilService.dismiss()
          this.utilService.presentToast("top", "Settings Saved !", "success")
        }, error => {
          this.utilService.presentToast("top", "Unable to Save Settings", "failed")
        }).catch(ex => {
          this.utilService.presentToast("top", "Unable to Save Settings", "failed")
        })
      } else{
        this.firestoreService.updateUserSettings(this.userSettingsService.user_settings_id,{
          capital: this.settingsForm.controls.capital.value,
          max_sl_amount: this.settingsForm.controls.max_sl_amount.value,
          max_trade_amount: this.settingsForm.controls.max_trade_amount.value,
          max_holding_limit: this.settingsForm.controls.max_holding_limit.value,
        }).then(res => {
          this.utilService.dismiss()
          this.utilService.presentToast("top", "Settings Updated !", "success")
        }, error => {
          this.utilService.presentToast("top", "Unable to Update Settings", "failed")
        }).catch(ex => {
          this.utilService.presentToast("top", "Unable to Update Settings", "failed")
        })
      }
    }
  }


}
