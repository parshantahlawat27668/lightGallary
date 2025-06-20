import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { emailValidator, phoneValidator } from "../utils/validator.js";
import otpGenerator from "otp-generator"

// Token genearate 
const tokenGenerater = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, "Somthing went wrong while generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!(name && password && phone)) {
        throw new apiError(400, "Please fill in all required details.");
    }
    if (email) emailValidator(email);
    phoneValidator(phone);
    const isUserExist = await User.findOne({ "phone.number": phone });
    if (isUserExist) {
        throw new apiError(409, "User already exists with email or phone");
    }
    let user;
    try {
        const otp = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            upperCase: false,
            specialChars: false
        });
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const phoneData = {};
        phoneData.number = phone;
        phoneData.otp = {
            code: otp,
            expiresAt: expiresAt
        }

        user = await User.create({
            name,
            email,
            phone: phoneData,
            password,
        });
        // Send otp
        console.log("Your verificaiton code is : ", user.phone.otp.code);
    } catch (error) {
        console.log(error);
        throw new apiError(400, "Something went wrong while registering user");
    }


    if (!user) {
        throw new apiError(500, "User registration failed");
    }
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;
    delete userData.phone.otp.code;
    delete userData.phone.otp.expiresAt;
    delete userData.phone.otp.attempts;


    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                userData,
                `Vefirication code send on mobile no. ${user.phone.number}`
            )
        )

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, phone, password } = req.body;
    if (!(password && (email || phone))) {
        throw new apiError(400, "Please fill in all required details");
    }
    if (email) emailValidator(email.id);
     phoneValidator(phone);

    const user = await User.findOne(email ? { "email.id": email } : { "phone.number": phone }).select("+password");

    if (!user) {
        throw new apiError(404, "User not found with the provided email or phone number.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(400, "Invalid password");
    }

    const { accessToken, refreshToken } = await tokenGenerater(user);

    const loggedInUser = await User.findById(user._id);
    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(
            new apiResponse(200, loggedInUser, loggedInUser.role === "admin" ? "Admin login successfully" : "User login successfully")
        )

});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: "" } }, { new: true });
    if (!user) {
        throw new apiError(401, "Unauthorized request");
    }
    return res
        .status(200)
        .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" })
        .clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" })
        .json(
            new apiResponse(200, user, "User logout Successfully")
        )
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request");
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new apiError(401, "Unauthorized request");
    }

    if (!decodedToken) {
        throw new apiError(401, "Invalid Refresh Token");
    }

    const user = await User.findById(decodedToken._id).select("+refreshToken");

    if (!user) {
        throw new apiError(404, "User not found");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new apiError(400, "Refresh token is Expired");
    }

    const { accessToken, newRefreshToken } = await tokenGenerater(user);

    const cleanedUser = user.toObject();
    delete cleanedUser.refreshToken;

    return res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 60 * 1000 })
        .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(
            new apiResponse(200, cleanedUser, "Access Token refreshed Successfully")
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

const getCurrentUser = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new apiError(401, "This feature is only for Admin");
    }
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new apiError(400, "User not found");
    }
    return res
        .status(200)
        .json(
            new apiResponse(200, { user }, "User fetched successfully")
        )
});

const getUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const query = {
        role: "user",
        $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ]

    }

    const users = await User.find(query).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    return res
        .status(200)
        .json(new apiResponse(200, { users, totalPages, page }, "User fetched successfully"))

});

const updateUserAccountDetails = asyncHandler(async (req, res) => {
    const { name, address } = req.body;
    if (!(name || address)) {
        throw new apiError(400, "Nothing to update");
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });

    return res
        .status(200)
        .json(new apiResponse(200, user, "User details updated successfully"))
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
        user.phone.otp.attempts = user.phone.otp.attempts + 1;
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

    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false
    });
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
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
    console.log("Your email verificaiton code is : ", otp);
    return res
    .status(200)
    .json(200,{},`Your email verification code is send to ${email}`)
});

const emailVerification = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!(email && otp)) {
        throw new apiError(400, "Please provid both email and otp");
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
        user.email.otp.attempts = user.email.otp.attempts + 1;
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
            new apiResponse(200, updatedUser, "Email verified success fully")
        )



});




// dev only controller 
const registerAdmin = asyncHandler(async (req, res) => {
    return res.status(400).json(new apiResponse(400, {}, "This feature is disable now"))

    const { name, email, phone, password, role } = req.body;
    if (!(name && email && phone && password && role)) {
        throw new apiError(400, "All fields are required");
    }

    let user;
    try {
        user = await User.create({
            name, email, phone, password, role
        });
    } catch (error) {
        console.log("Database Error : ", error);
        throw new apiError(400, "Somtehing went wrong while registering the Admin");
    }

    if (!user) {
        throw new apiError(400, "Something went wrong while registering the Admin");
    }
    const admin = user.toObject();
    delete admin.password;
    delete admin.refreshToken;
    return res
        .status(201)
        .json(new apiResponse(201, admin, "Admin Registered Successfully"))

});
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    registerAdmin,
    updateUserAccountDetails,
    deleteAccount,
    getUsers,
    phoneVerification,
    emailVerification,
    sendEmailVerificationCode
}