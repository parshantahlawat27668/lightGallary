import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import Order from "../../../models/order.model.js"
const getOrders = asyncHandler(async(req, res)=>{
    const orders = await Order.find();
    return res
    .status(200)
    .json(new apiResponse(200,orders, "Orders fetched successfully"))
});

export {getOrders};