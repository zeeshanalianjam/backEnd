import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // first request check in postman with status code and ok message
    //  res.status(200).json({
    //     message: "ok",
    // })

    // user register step --------------------------- important!
    // get user details from frontend
    // validation - not empty in field by user
    // check user if already exists or not: username , email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res


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
        $or: [{ username, email }]
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


    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    // create user object - create entry in db
    const user =  await User.create({
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        fullname,
    })


    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )


    // check for user creation 
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user!")
    }


    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully...")
    )

})

export default registerUser;