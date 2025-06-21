import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";

const getCurrentUser = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new apiError(401, "This feature is only for Admin");
    }
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new apiError(400, "User not found");
    }
    const responseUser = sanitizeUser(user);
    return res
        .status(200)
        .json(
            new apiResponse(200, { user:responseUser }, "User fetched successfully")
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
            { "email.id": { $regex: search, $options: "i" } }
        ]

    }

    const users = await User.find(query).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    return res
        .status(200)
        .json(new apiResponse(200, { users, totalPages, page }, "User fetched successfully"))

});

export {
    getCurrentUser,
    getUsers
};