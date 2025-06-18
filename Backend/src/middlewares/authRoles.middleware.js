import { apiError } from "../utils/apiError.js";

export const authRoles = (...roles) =>{
    return (req, res, next)=>{
    if(!roles.includes(req.user.role)){
     throw new apiError(403,"Only Admin can access this route");
    }
    next();
    }
}