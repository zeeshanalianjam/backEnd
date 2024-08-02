import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req, res) => {
    // first request check in postman with status code and ok message
    //  res.status(200).json({
    //     message: "ok",
    // })



    // get details from user 
    const {username, email, fullname, password} =  req.body
    console.log('Email: ', email);
    console.log('Password: ', password);
    


})

export default registerUser;