import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { emailValidator, phoneValidator } from "../../utils/validator.js";
import User from "../../models/user.model.js";
import { generateOTP } from "../../utils/generateOTP.js";


const phoneVerification = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;
    if (!(phone && otp)) {
        throw new apiError(400, "Please provide both phone no. and otp");
    }
    phoneValidator(phone);

    const user = await User.findOne({ "phone.number": phone }).select("+phone.otp.code +phone.otp.expiresAt +phone.otp.attempts");
    if (!user) {
        throw new apiError(404, "User not found");
    }

    if (user.phone.isVerified) {
        throw new apiError(409, "Phone no. is  already verified");
    }
    if (user.phone.otp.attempts >= 3) {
        await User.deleteOne({ "phone.number": user.phone.number });
        throw new apiError(403, "Too many invalid OTP attempts. Please re-register to try again.");
    }

    if (user.phone.otp.expiresAt <= new Date()) {
        throw new apiError(410, "OTP expired");
    }

    if (otp !== user.phone.otp.code) {
        user.phone.otp.attempts +=1;
        await user.save()
        throw new apiError(400, "Invalid OTP");
    }

    user.phone.otp.code = undefined;
    user.phone.otp.expiresAt = undefined;
    user.phone.isVerified = true;
    user.phone.otp.attempts = 0;
    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.refreshToken;


    return res
        .status(200)
        .json(
            new apiResponse(200, updatedUser, "Phone no. verified successfully")
        )

});

const sendEmailVerificationCode = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new apiError(400, "Please provid email id ");
    }
    emailValidator(email);

    const isRegistered = await User.findOne({ "email.id": email, "email.isVerified":true});

    if (isRegistered) {
        throw new apiError(404, "This email is already verified in other account");
    }

    const {otp, expiresAt} = generateOTP();
    const emailData = {};
    emailData.id = email;
    emailData.otp = {
        code: otp,
        expiresAt: expiresAt
    }

    const user = await User.findOneAndUpdate({ "phone.number": req.user.phone.number },{
        $set: {
            email: emailData
        }
    }, { new: true });

    if (!user) {
        throw new apiError(404, "User not found ");
    }
    console.log("Your email verification code is : ", otp);
    return res
    .status(200)
    .json(new apiResponse(200,{},`Verification code has been sent to ${email} `))
});

const emailVerification = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!(email && otp)) {
        throw new apiError(400, "Please provide both email and otp");
    }
    emailValidator(email);

    const user = await User.findOne({ "email.id": email }).select("+email.otp.code +email.otp.expiresAt +email.otp.attempts");
    if (!user) {
        throw new apiError(404, "User not found ");
    }

    if (user.email.isVerified) {
        throw new apiError(409, "Email id is already verified");
    }
    if (user.email.otp.attempts >= 3) {
        throw new apiError(403, "Too many invalid OTP attempts.");
    }
    if (new Date() >= user.email.otp.expiresAt) {
        throw new apiError(410, "OTP expired");
    }

    if (otp !== user.email.otp.code) {
        user.email.otp.attempts+=1;
        await user.save();
        throw new apiError(400, "Invalid OTP");
    }

    user.email.isVerified = true;
    user.email.otp.code = undefined;
    user.email.otp.expiresAt = undefined;
    user.email.otp.attempts = 0;
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.refreshToken;

    return res
        .status(200)
        .json(
            new apiResponse(200, updatedUser, "Email verified successfully")
        )



});

export {
    phoneVerification,
    sendEmailVerificationCode,
    emailVerification
}