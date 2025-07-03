import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from './services/user-settings/user-settings.service';
import { FirestoreService } from './services/firestore/firestore.service';
import { UtilService } from 'src/app/services/util/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private userSettingsService: UserSettingsService,
    private firestoreService: FirestoreService,
    private utilService: UtilService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.utilService.showLoading()
    this.firestoreService.getUserSettings().then(res => {
      if (res[0]) {
        this.userSettingsService.user_settings = res[0]
        this.userSettingsService.user_settings_id = res[0]['id']
        this.router.navigate(['/tabs'])
      }
      this.utilService.dismiss()
    }, error => this.utilService.dismiss())
  }
}
