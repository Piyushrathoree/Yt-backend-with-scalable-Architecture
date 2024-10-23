import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getVideoComments = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, "please provide videoId");
        }
        const { page = 1, limit = 10 } = req.query;
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "this video is not available in database");
        }

        const comments = await Comment.find({ video: videoId })
            .populate("user", "username ")
            .skip((page - 1) * limit)
            .limit(limit);
        if (!comments) {
            console.log(" no comments till now ");
        }
        res.status(200).json(
            new ApiResponse(200, comments, "all comment loaded successfully")
        );
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while getting all comments " + error.message
        );
    }
});

const addComment = asyncHandler(async (req, res) => {
    try {
        const { comment } = req.body;
        const { videoId } = req.params;
        console.log(videoId, comment);

        if (!videoId) {
            throw new ApiError(400, "please provide videoId");
        }
        if (!comment) {
            throw new ApiError(400, "please provide comment");
        }
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "this video is not available in database");
        }

        const newComment = new Comment({
            owner: req.user?._id,
            video: videoId,
            content: comment,
        });
        await newComment.save();

        res.status(201).json(
            new ApiResponse(201, newComment, "comment added successfully")
        );
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while adding new comment " + error.message
        );
    }
});

const updateComment = asyncHandler(async (req, res) => {
    try {
        const { comment } = req.body;
        const { commentId } = req.params;
        if (!commentId) {
            throw new ApiError(400, "please provide commentId");
        }
        if (!comment) {
            throw new ApiError(400, "please provide comment");
        }
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new ApiError(
                400,
                "this comment is not available in database"
            );
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content: comment },
            { new: true }
        );
        if (!updatedComment) {
            throw new ApiError(404, "comment not found");
        }
        res.status(200).json(
            new ApiResponse(200, updatedComment, "comment updated successfully")
        );
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while updating comment" + error.message
        );
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            throw new ApiError(400, "please provide commentId");
        }
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new ApiError(
                400,
                "this comment is not available in database"
            );
        }
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            throw new ApiError(404, "comment not found");
        }
        res.status(200).json(
            new ApiResponse(200, deletedComment, "comment deleted successfully")
        );
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while deleting comment" + error.message
        );
    }
});

export { getVideoComments, addComment, updateComment, deleteComment };
