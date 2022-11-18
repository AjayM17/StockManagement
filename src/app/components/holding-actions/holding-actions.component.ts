import { Component, OnInit } from '@angular/core';

import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-holding-actions',
  templateUrl: './holding-actions.component.html',
  styleUrls: ['./holding-actions.component.scss'],
})
export class HoldingActionsComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  selectAction(action) {
     this.popoverController.dismiss(null, action);
  }

}
