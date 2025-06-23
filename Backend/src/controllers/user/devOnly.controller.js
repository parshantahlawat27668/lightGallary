import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";

const registerAdmin = asyncHandler(async (req, res) => {
    // return res.status(400).json(new apiResponse(400, {}, "This feature is disable now"))

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

export {registerAdmin}