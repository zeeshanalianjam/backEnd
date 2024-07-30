import mongoose, { Model, Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    videofile:{
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
    },
    
    duration:{
        type: Number,
    },
    views:{
        type: Number,
        default: 0,
    },
    ispublished: {
        type: Boolean,
    }


}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = Model("Video", videoSchema)