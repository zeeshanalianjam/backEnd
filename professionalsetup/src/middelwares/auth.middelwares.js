import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "User Does not Login! Pleae before Login and try again")
        }
    
    
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT)
    
            const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")
          
            if(!user){
                throw new ApiError(401, "Invalid Access Token")
            }
    
            req.user = user
            next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid accesss token")
    }
  
})