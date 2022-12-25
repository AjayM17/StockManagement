export interface Holding {
    created_at?:number,
    trade_date:String,
    status:String,
    id?: String,
    name: String,
    quantity: number,
    buying_price: number,
    stop_loss: number,
    target_price:number,
    support_200_ema: String,
    tags:String
}