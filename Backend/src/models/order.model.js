import mongoose from 'mongoose'
import { type } from 'os';
import { title } from 'process';
const orderSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
orderItems:[{
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    title:{type:String},
    quantity:{type:Number, default:1},
    price:{type:Number}
}],
shippingAddress:{

},
paymentMethod:{
    type:String,
    default:"COD"
},
paymentStatus:{
type:String,
enum:["Paid", "Unpaid"],
default:"Unpaid"
},
paidAt:Date,
orderStatus:{
    type:String,
    enum:["Processing", "Shipped", "Delivered", "cancelled"],
    default:"Processing"
},
deliveredAt:Date,
itemsPrice:Number,
shippingPrice:Number,
totalPrice:Number
},{timestamps:true});

const  Order = mongoose.model("Order",orderSchema);
export default Order;