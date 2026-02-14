const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

// auto-create uploads folder
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Storage (to uploads folder temporarily)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow images only
const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error("No file uploaded"), false);
  }

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp", // IMPORTANT
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Only image files are allowed! Received: ${file.mimetype}`),
      false
    );
  }
};





const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: max 5MB
});

module.exports = upload;
