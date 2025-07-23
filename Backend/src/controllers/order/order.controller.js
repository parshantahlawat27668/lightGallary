import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";
import Order from "../../models/order.model.js";
import crypto from "crypto";
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });


const createOrder = asyncHandler(async (req, res) => {
  const {products, shippingAddress, paymentMethod, paymentResult} = req.body;
  const user = req.user;
  
  if (!products || products.length < 1) {
    throw new apiError(400, "No order items found");
  }
  
  if (!shippingAddress || !paymentMethod) {
    throw new apiError(400, "Shipping Address or Payment method missing");
  }
  const shippingAddressWithPhone = {...shippingAddress, phone:user.phone.number};
  if(paymentMethod==="online"){
    if(!paymentResult){
      throw new apiError(400,"Payment status could not be verified. Please do not refresh. If the amount is debited, contact support or check your order history after a few minutes."
      );
    }
  }

  let itemsPrice = 0;
  const shippingPrice = 60;

  for (let item of products) {
    const productFromDb = await Product.findById(item.product);
    if (!productFromDb) {
      throw new apiError(404, `Product not found: ${item.product}`);
    }
    
    const price = productFromDb.price; // Or discountPrice if needed
    itemsPrice += price * item.quantity;
  }
  
  const totalPrice = itemsPrice + shippingPrice;
  
  let isPaid = false;
  let paidAt = null;
  
   const order = await Order.create({
    user: user._id,
    products,
    shippingAddress:shippingAddressWithPhone,
    paymentMethod,
    orderStatus: "Processing",
    itemsPrice,
    shippingPrice,
    totalPrice,
  });


  
  // if (paymentMethod === "online") {
  //   if (!(paymentResult?.id && paymentResult?.orderId && paymentResult?.signature)) {
  //     throw new apiError(400, "Incomplete payment result");
  //   }

  //   const body = paymentResult.orderId + "|" + paymentResult.id;
  //   const expectedSignature = crypto
  //     .createHmac("sha256", process.env.RAZORPAY_SECRET)
  //     .update(body)
  //     .digest("hex");

  //   if (expectedSignature !== paymentResult.signature) {
  //     throw new apiError(400, "Invalid payment signature");
  //   }

  //   const razorpayPayment = await razorpay.payments.fetch(paymentResult.id);

  //   if (razorpayPayment.amount !== Math.round(totalPrice * 100)) {
  //     throw new apiError(400, "Payment amount mismatch");
  //   }

  //   if (razorpayPayment.currency !== "INR") {
  //     throw new apiError(400, "Currency mismatch");
  //   }

  //   if (razorpayPayment.status !== "captured") {
  //     throw new apiError(400, "Payment not captured");
  //   }


  //   isPaid = true;
  //   paidAt = new Date();
  //   order.paymentResult=paymentResult;
  //   order.isPaid=isPaid;
  //   order.paidAt=paidAt;
  // }



  return res
    .status(201)
    .json(new apiResponse(201,order, "Order Created Successfully"));
});

const cancelOrder = asyncHandler(async (req, res)=>{
  const user = req.user;
  const {orderId, cancelReason} = req.body;

  const order = await Order.findById(orderId);
  if(!order){
    throw new apiError(400,"Order not found ");
  }

  if(user._id.toString()!==order.user.toString()){
    throw new apiError(403,"You are not authorized to cancel this order");
  }

  if((["Shipped", "Delivered", "Cancelled"].includes(order.status))){
    throw new apiError(400,`Order already ${order.status}, cannot cancel`);
  }

  order.status = "Cancelled";
  if(cancelReason){
    order.cancelReason = cancelReason.trim();
  }
  order.cancelledAt = new Date();
  await order.save();

  return res
  .status(200)
  .json(new apiResponse(200,{order},"Order cancelled successfully"))
});

const getMyOrders = asyncHandler(async (req, res)=>{
const userId = req.user._id;
const orders = await Order.find({user:userId}).sort({createdAt:-1});
if(orders.length < 1){
  return res.status(200).json(new apiResponse(200,{orders},"No orders found"));
}
return res
.status(200)
.json(new apiResponse(200,{orders},"Orders fetched successfully"))

}); 
export {
  createOrder,
  cancelOrder,
  getMyOrders
};

