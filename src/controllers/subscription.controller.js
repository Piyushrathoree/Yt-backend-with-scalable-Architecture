import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    try {
        // Validate channelId
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            throw new ApiError(400, "Invalid channel ID");
        }

        // Find the channel by ID
        const channel = await User.findById(channelId);
        if (!channel) {
            throw new ApiError(404, "Channel not found");
        }

        // Find the current user (subscriber)
        const subscriber = await User.findById(req.user._id);
        if (!subscriber) {
            throw new ApiError(404, "Current user not found");
        }

        // Check if the subscription exists
        const existingSubscription = await subscription.findOne({
            subscriber: subscriber._id,
            channel: channel._id,
        });

        if (existingSubscription) {
            // Remove the subscription from the database
            await subscription.findOneAndDelete({
                subscriber: subscriber._id,
                channel: channel._id,
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        null,
                        "Subscription removed successfully"
                    )
                );
        } else {
            // Create a new subscription
            const newSubscription = new subscription({
                subscriber: subscriber._id,
                channel: channel._id,
            });

            await newSubscription.save();

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        newSubscription,
                        "Subscription added successfully"
                    )
                );
        }
    } catch (error) {
        // Error handling
        console.error("Error toggling subscription: ", error);
        return res.status(500).json(new ApiError(500, "Server error", error));
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    console.log(channelId);

    try {
        // Validate channelId
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            throw new ApiError(400, "Invalid channel ID");
        }

        // Find the channel by ID
        const channel = await User.findById(channelId);
        if (!channel) {
            throw new ApiError(404, "Channel not found");
        }

        // Fetch all subscriptions for this channel
        const subscriptions = await subscription.find({
            channel: channel._id,
        });

        // Extract subscriber IDs from the subscriptions
        const subscriberIds = subscriptions.map((sub) => sub.subscriber);
        console.log(subscriberIds);

        // Fetch all users who are subscribers
        const subscribers = await User.find({
            _id: { $in: subscriberIds },
        }).select(" -password -refreshToken");

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    subscribers,
                    "Channel's subscriber list fetched successfully"
                )
            );
    } catch (error) {
        // Error handling
        console.error("Error fetching channel's subscriber list: ", error);
        return res.status(500).json(new ApiError(500, "Server error", error));
    }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        // Find the current user (subscriber)
        const subscriber = await User.findById(req.user._id);
        if (!subscriber) {
            throw new ApiError(404, "Current user not found");
        }

        // Fetch subscriptions where the subscriber is the current user
        const subscriptions = await subscription.find({
            subscriber: subscriber._id,
        });

        // Extract the channel IDs from the subscriptions
        const channelIds = subscriptions.map((sub) => sub.channel);

        // Fetch all channels (users) that the current user has subscribed to
        const subscribedChannels = await User.find({
            _id: { $in: channelIds },
        }).select(" -password -refreshToken");

        // Return the list of subscribed channels
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    subscribedChannels,
                    "Subscribed channels fetched successfully"
                )
            );
    } catch (error) {
        // Error handling
        console.error("Error fetching subscribed channels: ", error);
        return res.status(500).json(new ApiError(500, "Server error", error));
    }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
