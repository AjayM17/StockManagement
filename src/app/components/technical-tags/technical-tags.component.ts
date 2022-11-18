import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Holding } from 'src/app/modals/holding';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import TechnicalTags from '../../../assets/local_json/technical_tags.json';


@Component({
  selector: 'app-technical-tags',
  templateUrl: './technical-tags.component.html',
  styleUrls: ['./technical-tags.component.scss'],
})
export class TechnicalTagsComponent implements OnInit {

  @Input("holding") holding:Holding;
  quesitons = TechnicalTags["questions"]
  selectedTags = []
  constructor(private modalController: ModalController, private firestoreService : FirestoreService) { }

  ngOnInit() { 
    if(this.holding.tags != undefined){
      this.selectedTags = JSON.parse(this.holding.tags.toString())
    }
  }

  selectTag(question_id, option_id, value) {
    const tag = {
      question_id:question_id,
      option_id:option_id,
      value:value
    }
    
    const index = this.selectedTags.findIndex( tags => tags.question_id ==  tag.question_id)
    if(index == -1){
      this.selectedTags.push(tag)
    } else {
      this.selectedTags[index]["option_id"] =  option_id
      this.selectedTags[index]["value"] =  value
    }
  }


  getBgColor(option_id, value) {
    const index = this.selectedTags.findIndex(tags => tags["option_id"] ==  option_id)
    if(index != -1){
      switch (value) {
        case 1:
          return "#81EE30"
        case 2:
          return "#129209"
  
        case -1:
          return "#FD5F05"
        case -2:
          return "#FB0303"
      }
    }
  }

  getTextColor(option_id) {
    const index = this.selectedTags.findIndex(tags => tags["option_id"] ==  option_id)
    if(index != -1){
     return "#ffffff"
    } else {
      return "#000000de"
    }
  }

  done(){
    this.firestoreService.updateHoldingTag(this.holding.id, JSON.stringify(this.selectedTags))
    this.modalController.dismiss()
  }

  cancel(){
    this.modalController.dismiss()
  }
}
