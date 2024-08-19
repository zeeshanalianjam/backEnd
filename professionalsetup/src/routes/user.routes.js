import { Router } from 'express'
import {registerUser , loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannel, getWatchHistory} from '../controllers/user.controllers.js'
import { upload } from '../middelwares/multer.middelwares.js'
import { verifyJWT } from '../middelwares/auth.middelwares.js'


const router = Router()


router.route("/register").post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'coverimage',
        maxCount: 1
    }
]), registerUser)


router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)
router.route("/update-coverImage").patch(verifyJWT, upload.single("coverimage"), updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT, getUserChannel)
router.route("/watch-history").get(verifyJWT, getWatchHistory)



export default router