import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Holding } from 'src/app/modals/holding';
import { Watchlist } from 'src/app/modals/watchlist';
import { getDocs, query, where } from 'firebase/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  /**
   * User Settings
   * @param  
   * @returns 
   */

  setUserSettings(settings: any) {
    const settingsRef = collection(this.firestore, 'user_settings');
    return addDoc(settingsRef, settings);
  }

  updateUserSettings(setting_id:string, settings:any){
    const holdingDocRef = doc(this.firestore, `user_settings/${setting_id}`);
    return updateDoc(holdingDocRef, settings);
  }

  getUserSettings() {
    const settingsRef = collection(this.firestore, 'user_settings');
    return collectionData(settingsRef, { idField: 'id' }).pipe(take(1)).toPromise();
  }

  /*
    Holdings
  */

  addHolding(holding: Holding) {
    holding.created_at = Date.now()
    const holdingRef = collection(this.firestore, 'holdings');
    return addDoc(holdingRef, holding);
  }

  getHoldings(status): Observable<Holding[]> {
    const holdingRef = collection(this.firestore, 'holdings');
    if(status != "All"){
      const statusq = query(holdingRef, where("status", "==", status))
      return collectionData(statusq, { idField: 'id' }) as Observable<Holding[]>;
    }
    return collectionData(holdingRef, { idField: 'id' }) as Observable<Holding[]>;
  }

  getHoldingsByName(name:String): Observable<Holding[]> {
    const holdingRef = collection(this.firestore, 'holdings');
      const typeq = query(holdingRef, where("name", "==", name))
      return collectionData(typeq, { idField: 'id' }) as Observable<Holding[]>;
  }

  async updateStopLoss(name,stopLoss) {
  const colRef = collection(this.firestore, 'holdings'); // replace with your actual collection name
  const q = query(colRef, where('name', '==', name), where('status', '==', 'active'));

  const querySnapshot = await getDocs(q);

  const updatePromises = querySnapshot.docs.map(docSnap => {
    const docRef = doc(this.firestore, 'holdings', docSnap.id);
    return updateDoc(docRef, { stop_loss: stopLoss }); // replace `newValue` with your desired value
  });

  await Promise.all(updatePromises);
}

  updateHoldingStatus(holding_id:string, status:string){
    const holdingDocRef = doc(this.firestore, `holdings/${holding_id}`);
    return updateDoc(holdingDocRef, { status:status});
  }
  
  updateHolding(holding: Holding) {
    const holdingDocRef = doc(this.firestore, `holdings/${holding.id}`);
    return updateDoc(holdingDocRef, { name: holding.name, type:holding.type, trade_date:holding.trade_date, status:holding.status, quantity: holding.quantity, buying_price: holding.buying_price, stop_loss: holding.stop_loss,support_ema:holding.support_ema,support_time_frame:holding.support_time_frame });
  }

  updateHoldingTag(id, tags) {
    const holdingDocRef = doc(this.firestore, `holdings/${id}`);
    return updateDoc(holdingDocRef, { tags: tags });
  }

  deleteHolding(id) {
    const holdingDocRef = doc(this.firestore, `holdings/${id}`);
    return deleteDoc(holdingDocRef);
  }



    /*
    History
  */

    addToHistory(holding: Holding) {
      holding.created_at = Date.now()
      const holdingRef = collection(this.firestore, 'history');
      return addDoc(holdingRef, holding);
    }


  /*
    Watchlist
  */


  addWatchist(watchlist: Watchlist) {
    watchlist.created_at = Date.now()
    const watchlistRef = collection(this.firestore, 'watchlists');
    return addDoc(watchlistRef, watchlist);
  }


  getWatchlists(): Observable<Watchlist[]> {
    const watchlistRef = collection(this.firestore, 'watchlists');
    return collectionData(watchlistRef, { idField: 'id' }) as Observable<Watchlist[]>;
  }

  // getHoldings(): Observable<Holding[]> {
  //   const holdingRef = collection(this.firestore, 'holdings');
  //   return collectionData(holdingRef, { idField: 'id'}) as Observable<Holding[]>;
  // }

  // updateHolding(holding: Holding) {
  //   const holdingDocRef = doc(this.firestore, `holdings/${holding.id}`);
  //   return updateDoc(holdingDocRef, { name: holding.name, quantity: holding.quantity, buying_price:holding.buying_price,time_frame:holding.time_frame, stop_loss:holding.stop_loss });
  // }

  // updateHoldingTag(id,tags){
  //   const holdingDocRef = doc(this.firestore, `holdings/${id}`);
  //   return updateDoc(holdingDocRef, { tags: tags});
  // }

  // deleteHolding(id){
  //   const holdingDocRef = doc(this.firestore, `holdings/${id}`);
  //   return deleteDoc(holdingDocRef);
  // }
}

