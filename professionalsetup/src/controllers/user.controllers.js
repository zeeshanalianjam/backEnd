import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from '../models/user.models.js'


const registerUser = asyncHandler(async (req, res) => {
    // first request check in postman with status code and ok message
    //  res.status(200).json({
    //     message: "ok",
    // })



    // get details from user 
    const { username, email, fullname, password } = req.body
    console.log('Email: ', email);
    console.log('Password: ', password);

    // validation setting
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




})

export default registerUser;