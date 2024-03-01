const multer = require("multer");
const multerMiddleware = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.STATIC_IMAGE_DIRNAME);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + "." + ext);
    },
  });

  return multer({ storage: storage });
};

module.exports = multerMiddleware;
