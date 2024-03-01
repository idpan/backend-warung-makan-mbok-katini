const express = require("express");
const router = express.Router();

const multerMiddleware = require("../helper/multerMiddleware");
const {
  getTumpeng,
  createTumpeng,
  updateTumpeng,
  deleteTumpeng,
} = require("../controllers/tumpengController");
const requireAuth = require("../middleware/requireAuth");
// authentication middleware
router.use(requireAuth);

// get all Tumpeng
router.get("/", getTumpeng);
// crete a new Tumpeng
router.post("/", multerMiddleware().single("image"), createTumpeng);
// update a Tumpeng
router.patch("/:id", multerMiddleware().single("image"), updateTumpeng);
// delete a Tumpeng
router.delete("/:id", deleteTumpeng);

module.exports = router;
