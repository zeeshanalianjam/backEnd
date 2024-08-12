import { Router } from 'express'
import {registerUser , loginUser} from '../controllers/user.controllers.js'
import { upload } from '../middelwares/multer.middelwares.js'


const router = Router()

router.route("/login").post(loginUser)

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

export default router