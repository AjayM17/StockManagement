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
  tags = TechnicalTags["tags"]
  selectedTags: { id: number, label: string, category_id: number }[] = [];
  constructor(private modalController: ModalController, private firestoreService : FirestoreService) { }

  ngOnInit() { 
    this.selectedTags = this.holding.tags
    // if(this.holding.tags != undefined){
    //   this.selectedTags = JSON.parse(this.holding.tags.toString())
    // }
  }

selectTag(categoryId: number, tag: any) {
  const isSelected = this.selectedTags.some(
    t => t.category_id === categoryId && t.id === tag.id
  );

  if (isSelected) {
    // Deselect the tag (toggle off)
    this.selectedTags = this.selectedTags.filter(
      t => !(t.category_id === categoryId && t.id === tag.id)
    );
  } else {
    // Replace any existing tag in this category
    this.selectedTags = this.selectedTags.filter(t => t.category_id !== categoryId);

    // Select the new tag
    this.selectedTags.push({
      id: tag.id,
      label: tag.label,
      category_id: categoryId
    });
  }
}


  isSelected(categoryId: number, tag: any): boolean {
    return this.selectedTags.some(t => t.category_id === categoryId && t.id === tag.id);
  }

  getSelectedTag(categoryId: number) {
    return this.selectedTags.find(t => t.category_id === categoryId);
  }





  done(){
    this.firestoreService.updateHoldingTag(this.holding.id, JSON.stringify(this.selectedTags))
    this.modalController.dismiss()
  }

  cancel(){
    this.modalController.dismiss()
  }

  
}
