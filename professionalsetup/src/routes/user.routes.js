import { Router } from 'express'
import {registerUser , loginUser, logoutUser, refreshAccessToken} from '../controllers/user.controllers.js'
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



export default router