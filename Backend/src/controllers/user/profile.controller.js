import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";
import Product from "../../models/product.model.js"
import mongoose from "mongoose";
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
        .json(new apiResponse(200, { user: responseUser }, "User details updated successfully"))
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

const toggleWishlistProducts = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
        throw new apiError(404, "Product Id is required ");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new apiError(400, "Invalid Product Id");
    }

    const wishListIds = user.wishList.map((id) => id.toString());
    const isProductExists = wishListIds.includes(productId);
    if (isProductExists) {
        user.wishList = user.wishList.filter((id) => id.toString() !== productId);
    }
    else {
        user.wishList.push(productId);
    }

    const updatedUser = await user.save();

    return res
        .status(200)
        .json(new apiResponse(200, { user: updatedUser }, "Wishlist updated"))
});

const getWishlist = asyncHandler(async (req, res) => {
    const user = req.user;
    const wishListProductsId = user.wishList;
    const wishListProducts = await Product.find({ _id: { $in: wishListProductsId } });
    if (!wishListProducts) {
        throw new apiError(400, "somthing went wrong");
    }

    return res
        .status(200)
        .json(new apiResponse(200, { wishListProducts }, "Wishlist fetched successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
    const user = req.user;
    const { productId, quantity } = req.body;
    if (!productId) {
        throw new apiError(404, "Invalid product id");
    }
    const product = await Product.findById(productId);

    if (!product) {
        throw new apiError(404, "Product not found");
    }

    const isExist = user.cart.find((product) => product.product.toString() === productId.toString());

    if (!isExist) {
        console.log("error yahi hai");
        user.cart.push({ product: productId, quantity: quantity, price: product.price });
    }

    const updatedUser = await user.save();
    return res
        .status(200)
        .json(new apiResponse(200, { user: updatedUser }, "Product add to cart successfully"))
});

const getCartProducts = asyncHandler(async(req, res)=>{
    const user = req.user;
    const cartProducts = user.cart;
    const cartProductsId = [];
    cartProducts.map((product)=>cartProductsId.push(product.product));

    const products = await Product.find({_id:{
        $in:cartProductsId
    }});

});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = req.user;
    if (!productId?.trim()) {
        throw new apiError(400, "Product Id is missing ");
    }
    const updatedCartList = user.cart.filter((product) => product.product.toString() !== productId);
    user.cart = updatedCartList;
    const updatedUser = await user.save();
    return res
        .status(200)
        .json(new apiResponse(200, { user: updatedUser }, "Product Remove Successfully"))
});

const updateCartQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const user = req.user;
    if (!quantity || quantity < 1) {
        throw new apiError(400, "Quantity must be at least 1");
    }
    const cartProduct = user.cart.find((product) => product.product.toString() === productId);
    if (!cartProduct) {
        throw new apiError(404, "Product not found");
    }
    cartProduct.quantity = quantity;
    const updatedUser = await user.save();
    return res
        .status(200)
        .json(new apiResponse(200, { user: updatedUser }, "Quantity Updated Successfully"))
});


export {
    updateUserAccountDetails,
    deleteAccount,
    toggleWishlistProducts,
    getWishlist,
    addToCart
}