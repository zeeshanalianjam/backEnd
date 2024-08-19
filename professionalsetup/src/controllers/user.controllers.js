import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

// genrate access and refresh tokens with seprate async func
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        // generate access and refresh tokens
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while genrating access and refresh tokens'
        )
    }
}

// register user code
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
    if (
        [username, email, fullname, password].some(
            (fields) => fields?.trim() === ''
        )
    ) {
        throw new ApiError(400, 'All fields are required ')
    }

    // check user already exist or not
    const userExist = await User.findOne({
        $or: [{ username, email }],
    })

    if (userExist) {
        throw new ApiError(409, 'User with email or username already exists!')
    }

    // set images path and check avatar is available or not
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverimageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is required')
    }

    let coverimageLocalPath
    if (
        req.files &&
        Array.isArray(req.files.coverimage) &&
        req.files.coverimage.length > 0
    ) {
        coverimageLocalPath = req.files.coverimage[0].path
    }

    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverimageLocalPath)
    if (!avatar) {
        throw new ApiError(400, 'Avatar file is required')
    }

    // create user object - create entry in db
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverimage: coverimage?.url || '',
        fullname,
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        '-password -refreshtoken'
    )

    // check for user creation
    if (!createdUser) {
        throw new ApiError(
            500,
            'Something went wrong while registering the user!'
        )
    }

    // return res
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, 'User registered Successfully...')
        )
})

// Login user code
const loginUser = asyncHandler(async (req, res) => {
    // req.body get karna ha data
    // username or email require validation lagani ha
    // find the user
    // password require to login
    // access and refresh token
    // send cookies

    // req.body get karna ha data
    const { username, email, password } = req.body
    console.log('Username : ', username, email, password)

    // username or email require validation lagani ha
    if (!username && !email) {
        throw new ApiError(400, 'username or email is required')
    }

    // find the user
    const user = await User.findOne({
        $or: [{ username }, { email }],
    })

    // check user is available or not
    if (!user) {
        throw new ApiError(400, "user doesn't exist")
    }

    // password require to login
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid user credentials')
    }

    // access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    )

    // logedInUser
    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    )

    // send cookies
    const options = {
        httpOnly: true,
        secure: true,
    }

    // successfully res
    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User logged in successfully...'
            )
        )
})

// Logout user code
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined,
            },
        },
        {
            new: true,
        }
    )

    // options
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully...'))
})

// refreshToken access
const refreshAccessToken = asyncHandler(async (req, res) => {
    // check if refresh token is provided in cookies or body
    const incomingRefreshToken =
        (await req.cookies.refreshToken) || req.body.refreshToken

    // check if refresh token is valid or not
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'No refresh token provided')
    }

    try {
        // verify with the jwt to refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRECT
        )

        // find the token of user id from the database
        const user = await User.findById(decodedToken?._id)

        // if user not found throw error
        if (!user) {
            throw new ApiError(401, 'Invalid refresh token')
        }

        //  compare the refresh token with form decoded
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Refresh token is expired or used')
        }

        // options
        const options = {
            httpOnly: true,
            secure: true,
        }

        // generate new access token
        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id)

        //   finall response
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    { accessToken, refreshToken: newRefreshToken },
                    'Acess Token has been refreshed')
            )
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token')
    }
})

// changeCurrentPasswrod
const changeCurrentPassword = asyncHandler(async (req, res) => {
    //GET THE OLD PASSW0RD FROM req.body
    //grab the old password from the auth middleware
    //veirfying the old password
    //if not valid throw error
    //if valid then update the password in db

    //GET THE OLD PASSW0RD FROM req.body
    const { oldPassword, newPassword } = req.body

    //grab the old password from the auth middleware
    const user = await User.findById(req.user?._id)

    //veirfying the old password
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    //if not valid throw error
    if (!isPasswordCorrect) {
        throw new ApiError(401, 'old password is incorrect')
    }

    //if valid then update the password in db
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    // show response to the user
    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password has been changed'))
})

//geting the current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fatched successfully..."))
})

// updateAccountDetails / upade user details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email, fullname } = req.body

    //validation

    if (!email || !fullname) {
        throw new ApiError(400, 'email and fullname are required')
    }

    //find the user

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email,
                fullname,
            },
        },

        { new: true }
    )

    //reponse to the user with new apiResponse utils
    return res
        .status(200)
        .json(new ApiResponse(200, user, 'account details has been updated'))
})

// update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    //get the image from the request
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, 'avatar is missing')
    }

    //upload image to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(401, 'avatar url is not founded')
    }

    //find the user
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },

        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'avatar has been uploaded'))
})

// update user cover image
const updateUserCoverImage = asyncHandler(async (req, res) => {
    // taking the new path of coverimage
    const coverimageLocalPath = req.file?.path

    // check the existence of coverimage
    if (!coverimageLocalPath) {
        throw new ApiError(400, 'Cover iamge file not found')
    }

    //    upload coverimage to the cloudinary
    const coverimage = await uploadOnCloudinary(coverimageLocalPath)

    //  check the if url is founded or not
    if (!coverimage.url) {
        throw new ApiError(400, 'Cover iamge url not found')
    }

    //  if find and update the user schema
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverimage: coverimage.url,
            },
        },
        {
            new: true,
        }
    )

    //  validate the user exist or not form the user schema
    if (!user) {
        throw new ApiError(404, 'User not exist')
    }

    //  final response send to user
    return res.status(200).json(new ApiResponse(200, user, 'coverImage has been uploaded'))


})

// get user channel
const getUserChannel = asyncHandler(async (req, res) => {
    // getting the user details from req.params means URL
    const { username } = req.params

    //  validation on username
    if (!username?.trim()) {
        throw new ApiError(400, 'username is missing!')
    }

    //  creating the channel with help of aggregation piplines
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'channel',
                as: 'Subscriber',
            },
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'subscriber',
                as: 'SubscribedTo',
            },
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: '$subscribers',
                },
                channelSubscribedToCount: {
                    $size: '$SubscribedTo',
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, '$subscribers.subscriber'],
                            then: true,
                            else: false,
                        },
                    },
                },
            },
        },
        {
            $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
                coverimage: 1,
                email: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
            },
        },
    ])

    //  validation for the user channel
    if (!channel?.length) {
        throw new ApiError(401, 'User channel does not exist')
    }

    //  final resposne
    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                channel[0],
                'User channel fetched successfully...'
            )
        )
})

// get watchHistory
const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchhistory',
                foreignField: '_id',
                as: 'watchhistory',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: '$owner',
                            },
                        },
                    },
                ],
            },
        },
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchhistory,
                'Watch history fecthed successfully...'
            )
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannel,
    getWatchHistory,
}
