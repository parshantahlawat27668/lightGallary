import {asyncHandler} from "../../../utils/asyncHandler.js"
import {apiResponse} from "../../../utils/apiResponse.js"
import {apiError} from '../../../utils/apiError.js'
import Product from "../../../models/product.model.js"
const getAdminProducts = asyncHandler(async(req, res)=>{
    const products = await Product.find();
    return res
    .status(200)
    .json(new apiResponse(200,products, "Products fetched successfully"))
});

export {getAdminProducts};