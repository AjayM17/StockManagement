export interface Holding {
    created_at?:number,
    id?: String,
    name: String,
    quantity: number,
    buying_price: number,
    time_frame:String,
    stop_loss: number,
    tags?:String,
    selling_price?:String
}