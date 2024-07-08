import multer from "multer";
import path from "path";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, //50 mb in size
  storage: multer.diskStorage({
    destination: "uploads/avatar",
    filename: (_req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  }),

  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);

    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" 
        ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }
    cb(null, true);
  },
});

export default upload;
