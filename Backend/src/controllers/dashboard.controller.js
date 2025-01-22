// channel dashboard
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            throw new ApiError(400, "Invalid channel ID");
        }

        const videoCount = await Video.countDocuments({ owner: channelId });
        const subscriberCount = await subscription.countDocuments({
            channel: channelId,
        });
        const likeCount = await Like.countDocuments({ likedBy: channelId });

        // Aggregate to calculate total views for the channel
        const totalViewsResult = await Video.aggregate([
            { $match: { owner: channelId } }, // Find videos that belong to the channel
            { $group: { _id: null, totalViews: { $sum: "$views" } } }, // Sum up the views
        ]);

        // Extract the total views count    
        const totalViewsCount =
            totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    videoCount,
                    subscriberCount,
                    likeCount,
                    totalViews: totalViewsCount, // Include total views in the response
                },
                "Channel stats fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while fetching channel stats"
        );
    }
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const { channelId } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            throw new ApiError(400, "Invalid channel ID");
        }
        const videos = await Video.find({ owner: channelId });
        if (!videos) {
            throw new ApiError(404, "No videos found for the channel");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { videos },
                    "Channel videos fetched successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while fetching channel videos"
        );
    }
});

export { getChannelStats, getChannelVideos };
