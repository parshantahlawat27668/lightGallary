import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email ID is required"],
        lowercase: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        default: ""
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: {
            type: String,
            default: "India"
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity:{
            type:Number,
            default:1
        },
        price:Number
    }
    ],
    refreshToken:{
      type:String,
      default:""
    }
},

    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
export default User;