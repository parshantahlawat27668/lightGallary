import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { emailValidator, phoneValidator } from "../../utils/validator.js";
import User from "../../models/user.model.js";
import { generateOTP } from "../../utils/generateOTP.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";
import {tokenGenerator} from "../../utils/tokenGenerator.js";

const sendForgotPasswordOtpToEmail = asyncHandler(async (req, res)=>{
const {email} = req.body;
if(!email){
throw new apiError(400,"Email id is required");
}
emailValidator(email);
const user = await User.findOne({"email.id":email,"email.isVerified":true}).select("+forgotPassword.email.code +forgotPassword.email.expiresAt");
if(!user){
throw new apiError(404,"User not found or email is not verified.");
}

const {otp, expiresAt} = generateOTP();
user.forgotPassword.email={
    code:otp,
    expiresAt:expiresAt
}
await user.save();
console.log("Forgot password email otp is : ",otp);

return res
.status(200)
.json(
    new apiResponse(200,{},`OTP has been sent to: ${email}`)
)
});

const verifyForgotPasswordOtpFromEmail = asyncHandler(async (req, res)=>{
const {email, otp} = req.body;
if(!(email && otp)){
throw new apiError(400,"Both email and OTP are required");
}
emailValidator(email);
const user = await User.findOne({"email.id":email,"email.isVerified":true}).select("+forgotPassword.email.code +forgotPassword.email.expiresAt");

if(!user){
throw new apiError(404,"User not found or email is not verified.");
}
if(user.forgotPassword.email.expiresAt<= new Date()){
throw new apiError(400,"OTP has expired. Please request a new one.");
}
if(user.forgotPassword.email.attempts>=3){
throw new apiError(403, "Too many invalid OTP attempts.");
}
if(user.forgotPassword.email.code!==otp){
user.forgotPassword.email.attempts = await user.forgotPassword.email.attempts+1;
await user.save();
throw new apiError(400,"Invalid OTP");
}
const forgotPasswordToken = user.generateForgotPasswordToken();

user.forgotPassword.email.code=undefined;
user.forgotPassword.email.expiresAt=undefined;
user.forgotPassword.email.attempts=0;
await user.save();
return res
.status(200)
.cookie("forgotPasswordToken",forgotPasswordToken,{httpOnly:true,secure:true,sameSite:"none",maxAge:5 * 60 * 1000})
.json(
    new apiResponse(200,{forgotPasswordToken},"OTP verified")
)


});

const sendForgotPasswordOtpToPhone = asyncHandler(async (req, res)=>{
const {phone} = req.body;
if(!phone){
throw new apiError(400,"Phone no. is required");
}
phoneValidator(phone);
const user = await User.findOne({"phone.number":phone,"phone.isVerified":true}).select("+forgotPassword.phone.code +forgotPassword.phone.expiresAt");
if(!user){
throw new apiError(404,"User not found");
}

const {otp, expiresAt} = generateOTP();
user.forgotPassword.phone={
    code:otp,
    expiresAt:expiresAt
}
await user.save();
console.log("Forgot password by Phone otp is : ",otp);

return res
.status(200)
.json(
    new apiResponse(200,{},`OTP has been sent to: ${phone}`)
)
});

const verifyForgotPasswordOtpFromPhone = asyncHandler(async (req, res)=>{
const {phone, otp} = req.body;
if(!(phone && otp)){
throw new apiError(400,"Both phone and OTP are required");
}
phoneValidator(phone);
const user = await User.findOne({"phone.number":phone,"phone.isVerified":true}).select("+forgotPassword.phone.code +forgotPassword.phone.expiresAt");

if(!user){
throw new apiError(404,"User not found");
}
if(user.forgotPassword.phone.expiresAt<= new Date()){
throw new apiError(400,"OTP has expired. Please request a new one.");
}
if(user.forgotPassword.phone.attempts>=3){
throw new apiError(403, "Too many invalid OTP attempts.");
}
if(user.forgotPassword.phone.code!==otp){
user.forgotPassword.phone.attempts=user.forgotPassword.phone.attempts+1;
await user.save();
throw new apiError(400,"Invalid OTP");
}
const forgotPasswordToken = await user.generateForgotPasswordToken();

user.forgotPassword.phone.code=undefined;
user.forgotPassword.phone.expiresAt=undefined;
user.forgotPassword.phone.attempts=0;
await user.save();
return res
.status(200)
.cookie("forgotPasswordToken",forgotPasswordToken,{httpOnly:true,secure:true,sameSite:"none",maxAge:5 * 60 * 1000})
.json(
    new apiResponse(200,{forgotPasswordToken},"OTP verified")
)
});

const resetForgotPassword = asyncHandler(async (req, res)=>{
    const {newPassword} = req.body;
const forgotPasswordToken = req.cookies.forgotPasswordToken || req.headers["authorization"]?.replace("Bearer ", "");
if(!forgotPasswordToken){
throw new apiError(400,"Forgot password token is missing ");
}
let tokenInfo;
try {
    tokenInfo = jwt.verify(forgotPasswordToken, process.env.FORGOTPASSWORD_TOKEN_SECRET);
} catch (error) {
      throw new apiError(401, "Invalid or expired token");
}

if(tokenInfo.purpose!=="forgot-password"){
throw new apiError(400,"Invalid forgot password token");
}
const user = await User.findById(tokenInfo._id).select("+password +refreshToken");
if(!user){
throw new apiError(404,"User not found")
}
user.password=newPassword;
await user.save();
const {accessToken, refreshToken} = await tokenGenerator(user);
const responseUser = sanitizeUser(user);
return res
.status(200)
.clearCookie("forgotPasswordToken",{httpOnly:true,secure:true,sameSite:"none"})
.cookie("accessToken",accessToken,{httpOnly:true,secure:true,sameSite:"none",maxAge:30 * 60 * 1000})
.cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,sameSite:"none",maxAge:7 * 24 * 60 * 60 * 1000})
.json(
    new apiResponse(200,{user:responseUser, accessToken, refreshToken},"Password changed successfully")
)
});

const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
        throw new apiError(400, "Please enter both current and new passwords.");
    }

    const user = await User.findById(req.user?._id).select("+password");
    if (!user) {
        throw new apiError(400, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid password");
    }
    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(
            new apiResponse(200, {}, "Password updated successfully")
        )


});

export {
    sendForgotPasswordOtpToEmail,
    verifyForgotPasswordOtpFromEmail,
    sendForgotPasswordOtpToPhone,
    verifyForgotPasswordOtpFromPhone,
    resetForgotPassword,
    changeUserPassword
}