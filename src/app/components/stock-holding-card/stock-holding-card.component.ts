import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-holding-card',
  templateUrl: './stock-holding-card.component.html',
  styleUrls: ['./stock-holding-card.component.scss'],
})
export class StockHoldingCardComponent implements OnInit {

  @Input() stock: {
    name: string;
    buyPrice: number;
    slPrice: number;
    amount: number;
    profitLossPercentage: number;
    profitLossAmount: number;
  };
  constructor() { }

  ngOnInit() {}

}
