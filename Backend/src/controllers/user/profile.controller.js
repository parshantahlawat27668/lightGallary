import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";

const updateUserAccountDetails = asyncHandler(async (req, res) => {
    const { name, address } = req.body;
    if (!(name || address)) {
        throw new apiError(400, "Nothing to update");
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    const responseUser = sanitizeUser(user);

    return res
        .status(200)
        .json(new apiResponse(200, {user:responseUser}, "User details updated successfully"))
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

export {
    updateUserAccountDetails,
    deleteAccount
}