import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from '../models/user.models.js'


const registerUser = asyncHandler(async (req, res) => {
    // first request check in postman with status code and ok message
    //  res.status(200).json({
    //     message: "ok",
    // })

    // user register step
    // get user details from frontend
    // validation - not empty in field by user
    // check user if already exists or not: username , email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db


    // get details from user 
    const { username, email, fullname, password } = req.body

    // validation
    if ([username, email, fullname, password].some((fields) =>
        fields?.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required ")
    }

    // check user already exist or not
    const userExist = User.findOne({
        $or: [{username, email}]
    })

    if (userExist) {
        throw new ApiError(409, "User with email or username already exists!")
        
    }


    // set images path and check avatar is available or not
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverimageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    
   



})

export default registerUser;