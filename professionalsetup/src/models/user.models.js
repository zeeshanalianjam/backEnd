import mongoose, { model, Schema } from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullname:{
        type: String,
        lowercase: true,
        trim: true,
        
    },
    avatar: {
        type: String, // cloudinary url
        required: true,

    },
    coverimage: {
        type: String, // cloudinary url

    },
    password: {
        type: String,
        required: [true, 'Password is Required!'],
        trim: true,
    },
    refreshtoken: {
        type: String,
    },
    watchhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]

},{ timesstamps: true })

export const User = model("User", userSchema)