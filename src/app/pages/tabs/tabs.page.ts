import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  count = 0;
  constructor(private utilService: UtilService) { }

  ngOnInit() {
    this.utilService.count$.subscribe( count => {
      this.count = count
    })
  }

}
