import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params; // Get videoId from request params

    try {
        // Validate the videoId
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(404, "Invalid Video ID");
        }

        // Find the video by videoId
        const video = await Video.find({_id:videoId});
        console.log(video);
        
        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        // Find the user who is liking/unliking the video
        const likedBy = req.user; // Assuming req.user has the logged-in user's info

        // Check if the video has already been liked by this user
        const alreadyLiked = await Like.findOne({
            video: video._id,
            likedBy: likedBy._id,
        });

        if (alreadyLiked) {
            // If the video is already liked, remove the like (unlike)
            await Like.findOneAndDelete({
                video: video._id,
                likedBy: likedBy._id,
            });

            return res
                .status(200)
                .json(new ApiResponse(200, null, "Like removed successfully"));
        } else {
            // Otherwise, add a new like
            const like = new Like({
                video: video._id,
                likedBy: likedBy._id,
            });
            await like.save();

            return res
                .status(200)
                .json(new ApiResponse(200, like, "Video liked successfully"));
        }
    } catch (error) {
        console.error("Error toggling video like:", error);
        return res
            .status(500)
            .json(new ApiError(500, "Server error while toggling video like", error));
    }
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params; // Get comment from request params

    try {
        // Validate the comment
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new ApiError(404, "Invalid comment ID");
        }

        // Find the comment by comment
        const comment = await Comment.find({_id:commentId});
        console.log(comment);
        
        
        
        if (!comment) {
            throw new ApiError(404, "comment not found");
        }

        // Find the user who is liking/unliking the comment
        const likedBy = req.user; // Assuming req.user has the logged-in user's info

        // Check if the comment has already been liked by this user
        const alreadyLiked = await Like.findOne({
            comment: comment._id,
            likedBy: likedBy._id,
        });

        if (alreadyLiked) {
            // If the comment is already liked, remove the like (unlike)
            await Like.findOneAndDelete({
                comment: comment._id,
                likedBy: likedBy._id,
            });

            return res
                .status(200)
                .json(new ApiResponse(200, null, "Like removed successfully"));
        } else {
            // Otherwise, add a new like
            const like = new Like({
                comment: comment._id,
                likedBy: likedBy._id,
            });
            await like.save();

            return res
                .status(200)
                .json(new ApiResponse(200, like, "comment liked successfully"));
        }
    } catch (error) {
        console.error("Error toggling comment like:", error);
        return res
            .status(500)
            .json(new ApiError(500, "Server error while toggling comment like", error));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params; // Get comment from request params

    try {
        // Validate the comment
        if (!mongoose.Types.ObjectId.isValid(tweetId)) {
            throw new ApiError(404, "Invalid tweet ID");
        }

        // Find the comment by comment
        const tweet = await Tweet.find({_id:tweetId});
        console.log(tweet);
        
        
        
        if (!tweet) {
            throw new ApiError(404, "tweet not found");
        }

        // Find the user who is liking/unliking the comment
        const likedBy = req.user; // Assuming req.user has the logged-in user's info

        // Check if the comment has already been liked by this user
        const alreadyLiked = await Like.findOne({
            tweet: tweet._id,
            likedBy: likedBy._id,
        });

        if (alreadyLiked) {
            // If the comment is already liked, remove the like (unlike)
            await Like.findOneAndDelete({
                tweet: tweet._id,
                likedBy: likedBy._id,
            });

            return res
                .status(200)
                .json(new ApiResponse(200, null, "Like removed successfully"));
        } else {
            // Otherwise, add a new like
            const like = new Like({
                tweet: tweet._id,
                likedBy: likedBy._id,
            });
            await like.save();

            return res
                .status(200)
                .json(new ApiResponse(200, like, "tweet liked successfully"));
        }
    } catch (error) {
        console.error("Error toggling tweet like:", error);
        return res
            .status(500)
            .json(new ApiError(500, "Server error while toggling tweet like", error));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        
        const likedVideos = await Like.find({
            likedBy: req.user._id,
        });
        console.log("112");

        if (likedVideos === 0) {
            new ApiResponse(200, {}, " no liked video found ");
        }
        console.log("112");

        res.status(200).json(
            new ApiResponse(
                200,
                likedVideos,
                "liked videos fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(
            500,
            " something went wrong while fetching liked videos"
        );
    }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
