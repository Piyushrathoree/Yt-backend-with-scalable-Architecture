import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!(content || title)) {
            // tweet can be empty or without title
            throw new ApiError(401, "please enter the whole information ");
        }

        const tweet = new Tweet({
            title,
            content,
            owner: req.user._id,
        });
        await tweet.save();

        if (!tweet) {
            throw new ApiError(500, " something went wrong while tweeting ");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, tweet, "tweet successful"));
    } catch (error) {
        throw new ApiError(500, " internal server error ", error);
    }
});

const getUserTweets = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate the userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(404, "Invalid user ID");
        }

        // Fetch tweets where owner is the given userId
        const tweets = await Tweet.find({ owner: userId });

        // If no tweets found, return a 404 error
        if (tweets.length === 0) {
            throw new ApiError(404, "No tweets found for this user");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, tweets, "All tweets fetched successfully")
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while fetching tweets",
            error.message
        );
    }
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { newTitle, newContent } = req.body;

    if (!newTitle && !newContent) {
        throw new ApiError(400, "Field cannot be empty");
    }

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(401, "Please enter a valid ID");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                title: newTitle,
                content: newContent,
            },
        },
        { new: true }
    );

    if (!updatedTweet) {
        throw new ApiError(500, "Failed to update the tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(401, "Please enter a valid ID");
    }

    const deleteTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deleteTweet) {
        throw new ApiError(500, "tweet not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteTweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
