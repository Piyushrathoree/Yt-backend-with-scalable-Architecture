import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Fetch comments for a specific video or tweet
const getComments = asyncHandler(async (req, res) => {
    try {
        const { videoId, tweetId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        let filter = {};

        if (videoId) {
            if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, "Invalid video ID");
            filter.video = videoId;
        } else if (tweetId) {
            if (!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(400, "Invalid tweet ID");
            filter.tweet = tweetId;
        } else {
            throw new ApiError(400, "Please provide either videoId or tweetId");
        }

        const comments = await Comment.find(filter)
            .populate("owner", "username")
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json(new ApiResponse(200, comments, "Comments loaded successfully"));
    } catch (error) {
        throw new ApiError(500, "Error while fetching comments: " + error.message);
    }
});

// Add a comment to a specific video or tweet
const addComment = asyncHandler(async (req, res) => {
    try {
        const { comment } = req.body;
        const { videoId, tweetId } = req.params;

        if (!comment) throw new ApiError(400, "Please provide comment content");

        let newCommentData = { content: comment, owner: req.user?._id };

        if (videoId) {
            if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiError(400, "Invalid video ID");
            newCommentData.video = videoId;
        } else if (tweetId) {
            if (!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(400, "Invalid tweet ID");
            newCommentData.tweet = tweetId;
        } else {
            throw new ApiError(400, "Please provide either videoId or tweetId");
        }

        const newComment = new Comment(newCommentData);
        await newComment.save();

        res.status(201).json(new ApiResponse(201, newComment, "Comment added successfully"));
    } catch (error) {
        throw new ApiError(500, "Error while adding comment: " + error.message);
    }
});

// Update a specific comment
const updateComment = asyncHandler(async (req, res) => {
    try {
        const { comment } = req.body;
        const { commentId } = req.params;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(400, "Invalid comment ID");
        if (!comment) throw new ApiError(400, "Please provide comment content");

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { content: comment }, { new: true });
        if (!updatedComment) throw new ApiError(404, "Comment not found");

        res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Error while updating comment: " + error.message);
    }
});

// Delete a specific comment
const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(400, "Invalid comment ID");

        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) throw new ApiError(404, "Comment not found");

        res.status(200).json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Error while deleting comment: " + error.message);
    }
});

export { getComments, addComment, updateComment, deleteComment };
    