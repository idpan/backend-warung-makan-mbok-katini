const express = require("express");
const router = express.Router();

const multerMiddleware = require("../helper/multerMiddleware");
const {
  getNasiBox,
  createNasiBox,
  updateNasiBox,
  deleteNasiBox,
} = require("../controllers/nasiBoxController");
const requireAuth = require("../middleware/requireAuth");
// authentication middleware
router.use(requireAuth);
// get all NasiBox
router.get("/", getNasiBox);
// crete a new NasiBox
router.post("/", multerMiddleware().single("image"), createNasiBox);
// update a NasiBox
router.patch("/:id", multerMiddleware().single("image"), updateNasiBox);
// delete a NasiBox
router.delete("/:id", deleteNasiBox);

module.exports = router;
