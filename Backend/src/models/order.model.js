import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    title: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number }
  }],

  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "India" }
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD"
  },
  paymentResult:{
    id:String,
    orderId:String,
    signature:String
  },  
  isPaid: {
    type: Boolean,
    default:false
  },

  paidAt: Date,

  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Out For Delivery", "Delivered", "Cancelled"],
    default: "Processing"
  },

  deliveredAt: Date,

  itemsPrice: { type: Number },
  shippingPrice: { type: Number },
  totalPrice: { type: Number },


  cancelReason: { type: String },
  cancelledAt:{type:Date},


  trackingId: { type: String }

}, { timestamps: true });

const  Order = mongoose.model("Order",orderSchema);
export default Order;