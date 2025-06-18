import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

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

    const isUserExist = await User.findOne({ phone });
    if (isUserExist) {
        throw new apiError(409, "User already exists with email or phone");
    }
    let user;
    try {
        user = await User.create({
            name,
            email,
            phone,
            password,
        });
    } catch (error) {
        console.log(error);
        throw new apiError(400, "Somthing went wrong while registering user");
    }


    if (!user) {
        throw new apiError(500, "User registration failed");
    }
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                userData,
                "User Register Successfully"
            )
        )

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, phone, password } = req.body;
    if (!(password && (email || phone))) {
        throw new apiError(400, "Please fill in all required details");
    }

    const user = await User.findOne(email ? { email } : { phone }).select("+password");

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
            new apiResponse(200, loggedInUser, loggedInUser.role==="admin"?"Admin login successfully":"User login successfully")
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



// dev only controller 
const registerAdmin = asyncHandler(async (req, res) => {
    return res.status(400).json(new apiResponse(400,{},"This feature is disable now"))

    // const { name, email, phone, password, role } = req.body;
    // if (!(name && email && phone && password && role)) {
    //     throw new apiError(400, "All fields are required");
    // }

    // let user;
    // try {
    //     user = await User.create({
    //         name, email, phone, password, role
    //     });
    // } catch (error) {
    //     console.log("Database Error : ",error);
    //     throw new apiError(400, "Somtehing went wrong while registering the Admin");
    // }

    // if(!user){
    //    throw new apiError(400, "Something went wrong while registering the Admin");
    // }
    // const admin = user.toObject();
    // delete admin.password;
    // delete admin.refreshToken;
    // return res
    // .status(201)
    // .json(new apiResponse(201, admin, "Admin Registered Successfully"))

});
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    registerAdmin
}