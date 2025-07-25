import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        id: {
            type: String,
            default:undefined,
            lowercase: true,
            trim: true,
            unique: true,
            sparse: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "Invalid email id"
            },

        },
        isVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            code: { type: String, select: false },
            expiresAt: { type: Date, select: false },
            attempts: { type: Number, select: false, default: 0 }
        }
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        trim: true,
        minlength: 6,
        select: false
    },
    forgotPassword: {
        email: {
            code: { type: String, select: false },
            expiresAt: { type: Date, select: false },
            attempts: { type: Number, default: 0, select: false }
        },
        phone:{
            code: { type: String, select: false },
            expiresAt: { type: Date, select: false },
            attempts: { type: Number, default: 0, select: false }
        }
    },
    phone: {
        number: {
            type: String,
            unique: true,
            required: [true, "Phone no. is Required"],
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[6-9]\d{9}$/.test(v);
                },
                message: "Invalid phone number"
            }
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            code: { type: String, select: false },
            expiresAt: { type: Date, select: false },
            attempts: { type: Number, select: false, default: 0 }
        }
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    address: {
        address: { type: String, default: "", trim: true },
        city: { type: String, default: "", trim: true },
        state: { type: String, default: "", trim: true },
        pinCode: { type: String, default: "", trim: true },
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
        quantity: {
            type: Number,
            default: 1
        },
        price: Number
    }
    ],
    refreshToken: {
        type: String,
        default: "",
        select: false
    }
},

    {
        timestamps: true
    }
);
userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        role: this.role
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateForgotPasswordToken = async function (){
    return jwt.sign({
        _id:this._id,
        purpose:"forgot-password",
        role:this.role
    },
    process.env.FORGOTPASSWORD_TOKEN_SECRET,
    {expiresIn:process.env.FORGOTPASSWORD_TOKEN_EXPIRY}

);
}

const User = mongoose.model("User", userSchema);
export default User;