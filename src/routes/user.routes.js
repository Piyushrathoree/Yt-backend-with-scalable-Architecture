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
} from "../controllers/user.controller.js";
import { upload, uploadAvatar ,uploadCoverImage} from "../middlewares/multer.middleware.js";
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
router.route("/change-account-details").post(verifyJWT, updateAccountDetails);
router.route("/change-avatar").post(verifyJWT, uploadAvatar, updateUserAvatar);
router.route("/change-coverImage").post(verifyJWT ,uploadCoverImage ,updateUserCoverImage)
//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

export default router;
