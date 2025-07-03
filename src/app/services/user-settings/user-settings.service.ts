import { Injectable } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UtilService } from 'src/app/services/util/util.service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  user_settings = null
  user_settings_id = null
  constructor(private utilService: UtilService,
    private firestoreService: FirestoreService) { }
}
