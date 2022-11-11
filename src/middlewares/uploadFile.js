const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
const { errorResponse } = require("../helper/response");

const env = dotenv.config().parsed;

exports.uploadFile = (fieldName) => {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: "Rumaja",
        public_id: file.originalname + "-" + Date.now(),
      };
    },
  });

  const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      req.fileValidationError = {
        message: "Only image files are allowed!",
      };
      return cb(new Error("Only image files are allowed!"), false);
    }

    cb(null, true);
  };

  const maxSize = 2 * 1024 * 1024;

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return errorResponse(res, 400, req.fileValidationError);
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return errorResponse(
            res,
            400,
            `File size is too large. Max size is ${maxSize} MB`
          );
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return errorResponse(res, 400, "Only 1 file is allowed");
        }

        return errorResponse(res, 400, err);
      }

      // if (!req.file) {
      //   return errorResponse(res, 400, "File is required");
      // }

      return next();
    });
  };
};
