import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registeredUser = asyncHandler(async (req, res) => {
    //getting details from Frontend
    const { fullName, email, password, username } = req.body;

    //checks -if any of the field is empty
    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    // check if the user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(409, "user already exists");
    }

    // check for avatar file
    // console.log(req.files);

    const avatarLocalPath =
        req.files?.avatar &&
        Array.isArray(req.files.avatar) &&
        req.files.avatar.length > 0
            ? req.files.avatar[0].path
            : null;

    let coverImageLocalPath = null;
    if (
        req.files?.coverImage &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    //upload on cloudinary
    // Upload to Cloudinary
    const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath);

    const coverImageUploadResponse = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    // Only store the URL of the avatar and coverImage, not the full Cloudinary response
    const avatarUrl = avatarUploadResponse.secure_url; // or avatarUploadResponse.url
    const coverImageUrl = coverImageUploadResponse?.secure_url || ""; // Default to an empty string if no cover image is uploaded

    if (!avatarUrl) {
        throw new ApiError(409, "Failed to upload avatar");
    }
    //creating user once the image is uploaded
    const user = await User.create({
        fullName,
        username,
        password,
        email,
        avatar: avatarUrl,
        coverImage: coverImageUrl,
    });

    //removing password and refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    //checking for response
    if (!createdUser) {
        throw new ApiError(
            409,
            "something went wrong while registering the user "
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "user registered successfully")
        );
});

// method for generating access and refresh token
const generateAcessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(401, "user not found!!");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch {
        throw new ApiError(500, "something went wrong !!");
    }
};

const loginUser = asyncHandler(async (req, res) => {
    //getting details from user
    const { username, email, password } = req.body;

    //check if the user enter the details or not
    if (!username || (!email && !password)) {
        throw new ApiError(400, "all field are required");
    }

    //check if user exists
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(404, "user not found!!");
    }

    // check for password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "wrong password ");
    }

    //generate access and refresh token
    const { accessToken, refreshToken } =
        await generateAcessTokenAndRefreshToken(user._id);
    //removing password and refresh token from response
    const authenticatedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    //checking for response
    if (!authenticatedUser) {
        throw new ApiError(
            409,
            "something went wrong while authenticating the user "
        );
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    authenticatedUser,
                    accessToken,
                    refreshToken,
                },
                "user logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    // remove refresh token
    // remove cookies
    //we have access of user throw middleware
    await User.findByIdAndUpdate(
        req.user._id,
        {
            // $set: {
            //     refreshToken: undefined,
            // },//one more method to do the same thing
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken =
            req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(404, "Refresh token not found");
        }

        // Verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized access");
        }

        // Find the user by the token's _id
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(404, "Invalid refresh token");
        }

        // Check if the incoming refresh token matches the user's stored refresh token
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or used");
        }

        // Generate new access and refresh tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAcessTokenAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true, // Ensure this is set correctly for your environment (set to true for HTTPS)
            sameSite: "Strict", // Optional: add for enhanced security
        };

        // Clear old cookies before setting new ones
        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);

        // Set new cookies for access and refresh tokens
        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    const isPasswordCorrect = user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "wrong password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "your password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "user fetched successfully"));
});

// const updateAccountDetail = asyncHandler(async (req, res) => {
// const { currFullName, currUsername, newFullName, newUsername } = req.body;
// const user=await User.findById(req.user?._id)
// if(!user){
//   throw new ApiError(404, "user not found")
// }
// if(!(user.fullName=== currFullName)){
//   throw new ApiError(400,"wrong fullname")
// }
// if(!(user.username=== currUsername)){
//   throw new ApiError(400,"wrong username")
// }
// user.fullName= newFullName;
// user.username= newUsername;
// return res
// .status(200)
// .json(new ApiResponse(200,{},"account details update successfully"))
// });
//other method or more optimized method

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        await req.user?._id,
        {
            $set: {
                fullName,
                email,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "File not found");
    }

    // Find the user and check if they already have an avatar
    const user = await User.findById(req.user?._id);

    // If user has an old avatar, delete it from Cloudinary
    if (user?.avatarPublicId) {
        await deleteFromCloudinary(user.avatarPublicId);
    }

    // Upload the new avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
        throw new ApiError(400, "Avatar URL not found");
    }

    // Update user's avatar field in the database
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url }, // Correct syntax
        },
        {
            new: true,
        }
    ).select("-password");

    if (!updatedUser) {
        throw new ApiError(400, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, updatedUser, "Avatar file changed successfully")
    );
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "file not found");
    }
    // Find the user and check if they already have an avatar
    const user = await User.findById(req.user?._id);

    // If user has an old avatar, delete it from Cloudinary
    if (user?.coverImagePublicId) {
        await deleteFromCloudinary(user.coverImagePublicId);
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
        throw new ApiError(400, "avatar url not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { coverImage: coverImage.url },
        },
        {
            new: true,
        }
    ).select("-password");

    if (!updatedUser) {
        throw new ApiError(400, "user not found");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "coverImage file changed successfully"
        )
    );
});

const userChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
        throw new ApiError(400, "username is required");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        {
            $addFields: {
                isSubscribed: {
                    $in: [req.user?._id, "$subscribers.subscriber"],
                },
                then: true,
                else: false,
            },
        },
        {
            $project: {
                fullName: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                isSubscribed: 1,
                subscriber: 1,
                subscriberTo: 1,
                username: 1,
            },
        },
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "user not found");
    }

    res.status(200).json(
        new ApiResponse(200, channel[0], "user profile fetched successfully")
    );
});

const userWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.types.objectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "userWatchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: {
                    $lookup: {
                        from: "user",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: {
                            $project: {
                                // check it while running the code -put it outside of this nest and then see how will it work
                                fullName: 1,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    },
                    $addFields: {
                        owner: {
                            $first: "$owner", // this will convert the pipeline which shows the watch history into object from array and make it more easily accessible for the frontend developer
                        },
                    },
                },
            },
        },
    ]);
    return res
    .status(200)
    .json( new ApiResponse(
        200,
        user[0].watchHistory,
        "watch history fetched successfully"
    ))
});
export {
    registeredUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    userChannelProfile,
    userWatchHistory,
};
