import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Holding } from 'src/app/modals/holding';
import { Watchlist } from 'src/app/modals/watchlist';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }


  /*
    Holdings
  */

  addHolding(holding: Holding) {
    holding.created_at = Date.now()
    const holdingRef = collection(this.firestore, 'holdings');
    return addDoc(holdingRef, holding);
  }

  getHoldings(): Observable<Holding[]> {
    const holdingRef = collection(this.firestore, 'holdings');
    return collectionData(holdingRef, { idField: 'id' }) as Observable<Holding[]>;
  }

  updateHolding(holding: Holding) {
    const holdingDocRef = doc(this.firestore, `holdings/${holding.id}`);
    return updateDoc(holdingDocRef, { name: holding.name, quantity: holding.quantity, buying_price: holding.buying_price, time_frame: holding.time_frame, stop_loss: holding.stop_loss });
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