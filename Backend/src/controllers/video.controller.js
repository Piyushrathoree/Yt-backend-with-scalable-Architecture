import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

// const getAllVideos = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
//     //TODO: get all videos based on query, sort, pagination
//     userId = await User.findById(userId);
// });
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, userId } = req.query;

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // how do i implement query by related names just like we do on  youtube and how do i recommend new videos
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    let videos;
    if (!userId) {
        videos = await Video.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ [sortBy]: "ascending" });
    } else {
        videos = await Video.findById(userId)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ [sortBy]: "ascending" });
    }

    res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    console.log("publishVideo route hit");
    try {
        //get video details
        const { title, description } = req.body;

        //check for video details
        if (!title || !description) {
            throw new ApiError(400, "Title and description are required");
        }
        // console.log(title, description);

        //check for video received from local path and then check if its array and then check that it atleast contains a single video / video
        const videoLocalPath =
            req.files?.videoFile &&
            Array.isArray(req.files.videoFile) &&
            req.files.videoFile.length > 0
                ? req.files.videoFile[0].path
                : null;
        // console.log(videoLocalPath);

        //same check for thumbnail
        const thumbnailLocalPath =
            req.files?.thumbnail &&
            Array.isArray(req.files.thumbnail) &&
            req.files.thumbnail.length > 0
                ? req.files.thumbnail[0].path
                : null;
        // console.log(thumbnailLocalPath);

        if (!videoLocalPath || !thumbnailLocalPath) {
            throw new ApiError(400, "Video file and thumbnail are required");
        }

        //upload on cloudinary concurrently
        const videoUploadResponse = await uploadOnCloudinary(videoLocalPath);
        const thumbnailUploadResponse =
            await uploadOnCloudinary(thumbnailLocalPath);

        // console.log(videoUploadResponse.url, thumbnailUploadResponse.url);

        if (!videoUploadResponse || !thumbnailUploadResponse) {
            throw new ApiError(
                500,
                "Error uploading video or thumbnail to cloudinary"
            );
        }
        const videoUrl = videoUploadResponse.secure_url;
        const thumbnailUrl = thumbnailUploadResponse.secure_url;
        // console.log(" yaha tak code chal rhaa h");

        //create video in database
        const video = await Video.create({
            title,
            description,
            videoFile: videoUrl,
            thumbnail: thumbnailUrl,
            isPublished: true,
            owner: req.user._id,
            duration: 2000,
        });
        await video.save();

        //get the user
        const uploadVideoUser = await User.findById(req.user._id).select(
            " -password -refreshToken"
        );

        if (!uploadVideoUser) {
            throw new ApiError(400, "User not found");
        }

        res.status(200).json(
            new ApiResponse(200, uploadVideoUser, "Video upload successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong", error);
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;

        // check if this video is having valid mongodb object ID or not
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "this video is not available in database");
        }

        const video = await Video.findById(videoId).populate(
            "owner",
            "username"
        );

        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        res.status(200).json(
            new ApiResponse(200, video, "video fetched successfully")
        );
    } catch (error) {
        res.status(error.statusCode).json(
            new ApiError(500, "something went wrong while getting the video")
        );
    }
});

const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title = "", description = "", thumbnail = "" } = req.body;
        if (!videoId) {
            throw new ApiError(400, " videoId param not found");
        }
        const video = await Video.findByIdAndUpdate(
            videoId,
            { title, description, thumbnail },
            { new: true }
        );

        if (!video) {
            throw new ApiError(404, "Video not found");
        }
        res.status(200).json(
            new ApiResponse(200, video, "Video updated successfully")
        );
    } catch (error) {
        res.status(error.statusCode).json(
            new ApiError(500, "something went wrong while updating video")
        );
    }
});

// Controller to delete video and its thumbnail
const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, "videoId param not found");
        }

        // Find the video by ID
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        // Extract video URL and thumbnail URL
        const videoUrl = video.videoFile;
        const thumbnailUrl = video.thumbnail;

        if (!videoUrl || !thumbnailUrl) {
            throw new ApiError(
                400,
                "Video or thumbnail URL is missing in the video record"
            );
        }

        // Extract public_id for both video and thumbnail
        const videoPublicId = videoUrl.split("/").pop().split(".")[0]; // Video public_id
        const thumbnailPublicId = thumbnailUrl.split("/").pop().split(".")[0]; // Thumbnail public_id

        // Delete video from Cloudinary
        const cloudinaryResponseVideo = await deleteFromCloudinary(
            videoPublicId,
            "video"
        );
        const cloudinaryResponseThumbnail = await deleteFromCloudinary(
            thumbnailPublicId,
            "image"
        );

        // Check if both deletions were successful
        if (
            cloudinaryResponseVideo.result !== "ok" ||
            cloudinaryResponseThumbnail.result !== "ok"
        ) {
            throw new ApiError(
                500,
                "Error deleting video or thumbnail from Cloudinary"
            );
        }

        // Delete video from MongoDB
        const deletedVideo = await Video.findByIdAndDelete(videoId);

        // Return success response
        res.status(200).json(
            new ApiResponse(
                200,
                deletedVideo,
                "Video and thumbnail deleted successfully"
            )
        );
    } catch (error) {
        // Catch and forward any error
        console.error("Error deleting video: ", error);
        throw new ApiError(
            500,
            "Something went wrong while deleting the video",
            error
        );
    }
});

// Controller to toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID not found");
    }

    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Toggle the isPublished status
    video.isPublished = !video.isPublished;

    // Save the updated video
    await video.save();

    res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video publish status toggled to ${video.isPublished ? "Published" : "Unpublished"}`
        )
    );
});
const getVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Increment the views count
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    // Fetch the video details
    const video = await Video.findById(videoId).populate("owner", "username"); // Fetch owner details if needed
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Fetch the number of likes for this video
    const likeCount = await Like.countDocuments({ video: videoId });

    // Fetch the number of comments for this video
    const commentCount = await Comment.countDocuments({ video: videoId });

    // You can also fetch all the comments if needed (optional):
    // const comments = await Comment.find({ video: videoId }).populate('user', 'username');

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                video,
                stats: {
                    views: video.views,
                    likes: likeCount,
                    comments: commentCount,
                },
            },
            "Video details fetched successfully"
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideoDetails,
};
