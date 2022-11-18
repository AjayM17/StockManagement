import { Component, OnInit } from '@angular/core';
import { TimeFrame } from 'src/app/modals/time_frames';
import surveys from '../../../assets/local_json/technical_test.json'

@Component({
  selector: 'app-technical-settings',
  templateUrl: './technical-settings.page.html',
  styleUrls: ['./technical-settings.page.scss'],
})
export class TechnicalSettingsPage implements OnInit {

  SCAN_TIME_FRAME = TimeFrame.MONTHLY
  SELECTED_TIME_FRAME = TimeFrame.DAILY
  surveys = surveys
  step= 1
  survey
  constructor() { 
    this.getNextQuestion()
  }


  ngOnInit() {
  }

  getNextQuestion(){
    this.survey = surveys.find(survey => survey.step  == this.step)
  }

}
