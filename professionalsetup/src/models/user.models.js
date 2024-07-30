import mongoose, { model, Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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

userSchema.pre("save" , async function (next){
    if (!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = model("User", userSchema)