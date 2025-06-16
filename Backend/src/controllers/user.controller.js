import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import User from "../models/user.model.js";
const registerUser = asyncHandler(async(req, res)=>{
const {name, email, password, phone}= req.body;
if(!(name && password && (email || phone))){
throw new apiError(400,"Please fill in all required details.");
}
const isUserExist= await User.findOne({
    $or:[{email},{phone}]
});
if(isUserExist){
throw new apiError(409,"User already exists with email or phone");
}
const user = await User.create({
    name,
    email,
    phone,
    password,
});

if(!user){
throw new apiError(500,"User registration failed");
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

export {registerUser}