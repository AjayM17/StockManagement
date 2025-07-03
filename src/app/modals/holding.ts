export interface Holding {
    created_at?:number,
    trade_date:string,
    status:string,
    id?: string,
    name: string,
    type: string,
    quantity: number,
    buying_price: number,
    stop_loss: number,
    support_time_frame:number,
    support_ema:string,
    // target_price:number,
    // support_200_ema: String,
    tags?:any[],
}


export interface GroupedHolding  {
  name: string;
  buying_price: number;
  stop_loss:  number ;
  quantity: number;
  investment:number;
  breakdowns: Holding[];
  tags?:any[],
  showBreakdown?:boolean,
  _fallbackSet:boolean
};