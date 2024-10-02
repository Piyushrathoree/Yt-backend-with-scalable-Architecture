import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registeredUser = asyncHandler(async (req, res) => {
  //getting details from Frontend
  const { fullName, email, password, username } = req.body;

  //checks -if any of the field is empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
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
  console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
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
    coverImage: coverImageUrl ,
  });

  //removing password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //checking for response
  if (!createdUser) {
    throw new ApiError(409, "something went wrong while registering the user ");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export { registeredUser };
