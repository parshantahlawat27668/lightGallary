
    import jwt from "jsonwebtoken"
    import { emailValidator, phoneValidator } from "../../utils/validator.js";
    import User from "../../models/user.model.js";
    import { generateOTP } from "../../utils/generateOTP.js";
    import {tokenGenerator} from "../../utils/tokenGenerator.js";
    import { apiError } from "../../utils/apiError.js";
    import { apiResponse } from "../../utils/apiResponse.js";
    import { asyncHandler } from "../../utils/asyncHandler.js";

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
            const {otp, expiresAt} = generateOTP();
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
        if (email) emailValidator(email);
        phoneValidator(phone);

        const user = await User.findOne(email ? { "email.id": email } : { "phone.number": phone }).select("+password");

        if (!user) {
            throw new apiError(404, "User not found with the provided email or phone number.");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new apiError(400, "Invalid password");
        }

        const { accessToken, refreshToken } = await tokenGenerator(user);

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

        const { accessToken, newRefreshToken } = await tokenGenerator(user);

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

    export {
        registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken
    };
