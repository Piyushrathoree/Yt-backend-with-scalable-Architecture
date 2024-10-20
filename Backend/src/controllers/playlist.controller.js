import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser } from "./user.controller.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videoId } = req.body;
    if (!name && !description && videoId) {
        throw new ApiError(400, "name and description are required");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const newPlaylist = new Playlist({
        owner: req.user._id,
        name,
        description,
        videos: [videoId],
    });
    await newPlaylist.save();

    if (!newPlaylist) {
        throw new ApiError(404, "playlist not found ");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, newPlaylist, "Playlist created successfully")
        );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }

        const playlists = await Playlist.find({
            owner: userId,
        });

        if (playlists === 0) {
            new ApiResponse(200, {}, " no playlist  found ");
        }

        res.status(200).json(
            new ApiResponse(200, playlists, "playlists fetched successfully")
        );
    } catch (error) {
        throw new ApiError(
            500,
            " something went wrong while fetching playlists"
        );
    }
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(playlistId)) {
            throw new ApiError(400, "Invalid playlist ID");
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        res.status(200).json(
            new ApiResponse(200, playlist, "playlist fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "something went wrong while fetching playlist");
    }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(videoId && playlistId)) {
            throw new ApiError(400, "Invalid playlist or video ID");
        }
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { $push: { videos: videoId } },
            { new: true }
        );
        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }
        res.status(200).json(
            new ApiResponse(
                200,
                playlist,
                "Video added to playlist successfully"
            )
        );
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while adding video to playlist"
        );
    }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(videoId && playlistId)) {
            throw new ApiError(400, "Invalid playlist or video ID");
        }

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $pull: { videos: videoId },
            },
            { new: true }
        );

        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        res.status(200).json(
            new ApiResponse(
                200,
                playlist,
                "Video deleted to playlist successfully"
            )
        );
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while deleting video to playlist"
        );
    }
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(playlistId)) {
            throw new ApiError(400, "Invalid playlist ID");
        }

        const playlist = await Playlist.findByIdAndDelete(playlistId);
        if (!playlist) {
            throw new ApiError(404, "Playlist is already not there");
        }

        res.status(200).json(
            new ApiResponse(200, playlist, "playlist deleted successfully")
        );
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while deleting the playlist"
        );
    }
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { newName, newDescription } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(playlistId)) {
            throw new ApiError(400, "Invalid playlist ID");
        }

        if (!newName && !newDescription) {
            throw new ApiError(400, "name and description are required");
        }

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: {
                    name: newName,
                    description: newDescription,
                },
            },
            { new: true }
        );

        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        res.status(200).json(
            new ApiResponse(
                200,
                playlist,
                "Video added to playlist successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "something went wrong while updating playlist");
    }
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
