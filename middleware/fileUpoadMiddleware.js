const multer = require("multer");
// const UPLOAD_FOLDER = require(".././uploads")
const UPLOAD_FOLDER = "./uploads";
const path = require("path");

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, " ")
        .toLowerCase()
        .split(" ")
        .join("-") + Date.now();
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png, jpeg allowed!"));
    }
  },
});
module.exports = { upload };
