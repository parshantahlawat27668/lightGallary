import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product Title is Required"],
        trim: true
    },
    descrption: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: [true, "Product Price is Required"]
    },
    discountPrice: {
        type: Number
    },
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        front: {
            type: String,
            required: [true, "Front Image is required"]  
        },
        back: {
            type: String,
        }
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    subCategory: {
        type: String,
        required: [true, "Sub Category is required"]
    },

    brand: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default: 0
    },
    numOfRatingUser: {
        type: Number,
        default: 0
    },




},
    { timestamps: true });

const  Product = mongoose.model("Product", productSchema);
export   default Product; 