import mongoose from "mongoose";
import { type } from "os";
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product Title is Required"],
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    specifications: {
        wattage: { type: String },     // e.g. "10W"
        voltage: { type: String },     // e.g. "220V"
        colorTemperature: { type: String }, // e.g. "Warm White"
        warranty:{type:String}  // e.g. "2 year "
    },
    price: {
        type: Number,
        required: [true, "Product Price is Required"],
        min: [0, "Price cannot be negative"]
    },
    discountPrice: {
        type: Number,
        min: [0, "Discount cannot be negative"]
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be negative"]
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        front: {
            url: {
                type: String,
                required: [true, "Front Image is required"]
            },
            public_id:{type:String, required:true},
            resource_type:{type:String}
        },
        back: {
               url: {
                type: String
            },
            public_id:{type:String},
            resource_type:{type:String}
        }
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    subCategory: {
        type: String,
        required: [true, "Sub Category is required"],
        trim: true
    },

    brand: {
        type: String,
        default: "",
        trim: true
    },
    isPublish: {
        type: Boolean,
        default: true
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

const Product = mongoose.model("Product", productSchema);
export default Product; 