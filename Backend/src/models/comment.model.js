import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        tweet: {  // Reference to Tweet
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
        video: {  // Optional, if also used for video comments
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {  // The user who posted the comment
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        parentComment: {  // Reference to parent comment for replies
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        }
    },
    { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
