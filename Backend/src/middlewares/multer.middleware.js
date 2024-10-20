import multer from "multer";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});





const upload = multer({ storage });
const uploadAvatar = upload.single('avatar');
const uploadCoverImage= upload.single('coverImage')

export { upload ,uploadAvatar , uploadCoverImage};