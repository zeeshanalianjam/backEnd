import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
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