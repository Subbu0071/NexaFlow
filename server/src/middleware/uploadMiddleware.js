const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      return callback(null, true);
    }

    callback(new Error("Only Excel files are allowed."));
  },
});

module.exports = upload;
