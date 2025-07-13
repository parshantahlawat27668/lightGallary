import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";
import Product from "../../models/product.model.js"
const updateUserAccountDetails = asyncHandler(async (req, res) => {
    const { name, address } = req.body;
    if (!(name || address)) {
        throw new apiError(400, "Nothing to update");
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    const responseUser = sanitizeUser(user);

    return res
        .status(200)
        .json(new apiResponse(200, {user:responseUser}, "User details updated successfully"))
});

const deleteAccount = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.user?._id);
    if (!deletedUser) {
        throw new apiError(404, "User not found");
    }
    return res
        .status(200)
        .json(new apiResponse(200, {}, "User deleted successfully"))
});

const toggleWishlistProducts = asyncHandler(async (req, res)=>{
    const {productId} = req.body;
    const user = req.user;
    if(!productId){
        throw new apiError(404,"Product Id is required ");
    }
    const isProductExists = user.wishlist.includes(productId);
    if(isProductExists){
        user.wishlist=user.wishlist.filter((id)=>id!==productId);
    }
    else{
        user.wishlist.push(productId);
    }

      const updatedUser = await user.save();

      return res
      .status(200)
      .json(new apiResponse(200,{user:updatedUser},"Wishlist updated"))
});

const addToCart = asyncHandler(async(req, res)=>{
const user =req.user;
const {productId, quantity} = req.body;
const product = await Product.findById(productId);
if(!product){
    throw new apiError(404,"Invalid product id");
}

const isExist = user.cart.find((product)=>product.product.toString()===productId);

if(!isExist){
    user.cart.push({product:productId, quantity:quantity, price:product.price});    
}

const updatedUser = await user.save();
return res
.status(200)
.json(new apiResponse(200, {user:updatedUser}, "Product add to cart successfully"))
});

const removeFromCart = asyncHandler(async(req, res)=>{
const {productId} = req.params;
const user = req.user;
if(!productId?.trim()){
throw new apiError(400,"Product Id is missing ");
}
const updatedCartList = user.cart.filter((product)=>product.product.toString()!==productId);
user.cart=updatedCartList;
const updatedUser = await user.save();
return res
.status(200)
.json(new apiResponse(200,{user:updatedUser},"Product Remove Successfully"))
});

const updateCartQuantity = asyncHandler(async(req, res)=>{
const {productId, quantity} = req.body;
const user = req.user;
if (!quantity || quantity < 1) {
  throw new apiError(400, "Quantity must be at least 1");
}
const cartProduct =  user.cart.find((product)=>product.product.toString() === productId);
if(!cartProduct){
throw new apiError(404,"Product not found");
}
cartProduct.quantity = quantity;
const updatedUser = await user.save();
return res
.status(200)
.json(new apiResponse(200,{user:updatedUser},"Quantity Updated Successfully"))
});
export {
    updateUserAccountDetails,
    deleteAccount,
    toggleWishlistProducts
}