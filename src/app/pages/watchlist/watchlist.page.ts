import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Watchlist } from 'src/app/modals/watchlist';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
})
export class WatchlistPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  name: string = '';
  submit = false
  watchlists: Watchlist[] = []

  constructor(private firestoreService: FirestoreService, private cd: ChangeDetectorRef) {
    this.getWatchlists()
   }

  ngOnInit() {
  }

  getWatchlists() {
    this.firestoreService.getWatchlists().subscribe(res => {
      this.watchlists = res
      this.cd.detectChanges();
    })
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  save(){
    this.name = this.name.trim()
    this.submit = true
    if(this.name != ""){
      this.firestoreService.addWatchist({
        name:this.name
      })
    }
    this.modal.dismiss(null, 'save');
  }
  
  onWillDismiss(event: Event) {
  }
}
