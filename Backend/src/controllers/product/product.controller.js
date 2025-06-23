import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Product from "../../models/product.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js";


const addProduct = asyncHandler(async(req, res)=>{
const  {title, description, specifications, price, discountPrice, stock, category, subCategory, brand, isPublish} = req.body;
const files = req.files;
const requiredFields = [title, description, specifications, price, stock, category, subCategory, brand];
const allRequiredPresent = requiredFields.every(field => field !==undefined && field !==null && field !=="");
if(!allRequiredPresent){
throw new apiError(400, "All required fields must be properly filled.");
}
let parseSpecification;
try {
   parseSpecification = JSON.parse(specifications);
} catch (error) {
    throw new apiError(400,"Invalid specification format");
}
if(!files.frontImage){
    console.log(files.frontImage);
throw new apiError(400,"Front Image is required")
}

const isAlreadyExist = await  Product.findOne({title, "specifications.wattage":parseSpecification.wattage});
if(isAlreadyExist){
throw new apiError(400,"Product already exists");
}


let cloudinaryFrontImage, cloudinaryBackImage;
try {
   cloudinaryFrontImage = await uploadToCloudinary(files.frontImage[0].path);
if(files.backImage) { cloudinaryBackImage = await  uploadToCloudinary(files.backImage[0].path);}  
} catch (error) {
    throw new apiError(400,"Upload Image Failed")
}

const images={
    front:cloudinaryFrontImage,
}
if(cloudinaryBackImage){images.back=cloudinaryBackImage;}




const product = await Product.create({
    title,
    description,
    specifications:parseSpecification,
    price,
    discountPrice,
    stock,
    category,
    subCategory,
    brand,
    isPublish,
    images
});

if(!product){
throw new apiError (400,"Somthing went wrong while adding product");
}

return res
.status(201)
.json(
    new apiResponse(201,{product},"Product added successfully")
)
});

const deleteProduct = asyncHandler(async(req, res)=>{
const productId = req.params.id;

const product = await Product.findByIdAndDelete(productId);
if(!product){
throw new apiError(404,"Product not found");
}
await deleteFromCloudinary(product.images.front.public_id);
if(product.images.back?.public_id){
    
await deleteFromCloudinary(product.images.back.public_id);
}

return res
.status(200)
.json(new apiResponse(200,{},"Product deleted successfully"))
});

const updateProduct = asyncHandler(async (req, res)=>{
const {
    title,
    description,
    specifications,
    price,
    discountPrice,
    stock,
    category,
    subCategory,
    brand
} = req.body;
const productId = req.params.id;
const fieldForUpdate = {};
if(title) fieldForUpdate.title=title;
if(description) fieldForUpdate.description=description;
if(specifications) fieldForUpdate.specifications=specifications;
if(price!==undefined && price!==null) fieldForUpdate.price=price;
if(discountPrice!==undefined && discountPrice!==null) fieldForUpdate.discountPrice=discountPrice;
if(stock!== undefined && stock!== null) fieldForUpdate.stock=stock;
if(category) fieldForUpdate.category=category;
if(subCategory) fieldForUpdate.subCategory=subCategory;
if(brand) fieldForUpdate.brand=brand;

if(Object.keys(fieldForUpdate).length<1){
throw new apiError(400,"No fields provided for update");
}
const product = await Product.findByIdAndUpdate(productId,fieldForUpdate,{new:true});
if(!product){
throw new apiError(404,"Product not found");
}
return res
.status(200)
.json(new apiResponse(200,product,"Product updated successfully"))

});

const getProducts = asyncHandler(async (req, res)=>{
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20
const skip = (page-1) * limit;
const search = req.query.search || "";
const sortBy = req.query.sortBy || "createdAt";
const order = req.query.order === "asc" ? 1: -1;
const query = {
    isPublish:true,
    $or:[
            {category:{$regex:search, $options:"i"}},
            {subCategory:{$regex:search, $options:"i"}}
    ]
}
const products = await Product.find(query).sort({[sortBy]:order}).skip(skip).limit(limit);
const totalProducts = await Product.countDocuments(query);
const totalPages = Math.ceil(totalProducts/limit);
return res
.status(200)
.json(new apiResponse(200,{products, totalPages, page},"Products fetched successfully"))
});

const getProduct = asyncHandler(async (req, res)=>{
const productId = req.params.id;
const product = await Product.findById(productId);
if(!product || product.isPublish===false){
throw new apiError(404,"Product not found");
}
return res
.status(200)
.json(new apiResponse(200, product, "Product fetched successfully"))
});

export {
    addProduct,
    deleteProduct,
    updateProduct,
    getProducts,
    getProduct
    
};