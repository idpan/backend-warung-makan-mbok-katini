const express = require("express");
const router = express.Router();
const {
  getContent,
  updateContent,
} = require("../controllers/contentController");
const multerMiddleware = require("../helper/multerMiddleware");
const requireAuth = require("../middleware/requireAuth");
// authentication middleware
router.use(requireAuth);
// get content
router.get("/", getContent);
// update content
router.patch(
  "/:id",
  multerMiddleware().fields([
    { name: "hero_image" },
    { name: "section1_image" },
    { name: "section2_image" },
  ]),
  updateContent
);

module.exports = router;
