import {Router } from 'express'
import { registeredUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const router=Router();

router.route('/register').post(upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]), registeredUser);
  

export default router;
