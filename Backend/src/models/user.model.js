import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        trim:true,
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        default: "",
        trim:true
    },
    address: {
        street: {type:String, default:"", trim:true},
        city:{type:String, default:"", trim:true},
        state:{type:String, default:"", trim:true},
        postalCode:{type:String, default:"", trim:true},
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
      default:"",
      select:false
    }
},

    {
        timestamps: true
    }
);
userSchema.pre("save", async function (next) {
    if(this.isModified("password") && this.password){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
userSchema.methods.isPasswordCorrect = async function (password){
return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;