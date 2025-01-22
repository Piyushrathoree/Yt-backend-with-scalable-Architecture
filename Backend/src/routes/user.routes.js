import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registeredUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getCurrentUser,
    userChannelProfile,
    userWatchHistory,
} from "../controllers/user.controller.js";
import {
    upload,
    uploadAvatar,
    uploadCoverImage,
} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registeredUser
);

router.route("/login").post(loginUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/get-user").get(verifyJWT, getCurrentUser);
router.route("/change-account-details").patch(verifyJWT, updateAccountDetails);
router.route("/change-avatar").patch(verifyJWT, uploadAvatar, updateUserAvatar);
router
    .route("/change-coverImage")
    .patch(verifyJWT, uploadCoverImage, updateUserCoverImage);
//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/channel/:username").get(verifyJWT, userChannelProfile);
router.route("/history").get(verifyJWT, userWatchHistory);

export default router;
