import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NseService {

  url = "http://api.marketstack.com/v1/eod/latest?access_key=f2bb645391f94ce4e7a7ce0e91266429&symbols=CIPLA.XNSE"
  constructor() { }
}
