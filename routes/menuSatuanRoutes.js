const express = require("express");
const router = express.Router();

const multerMiddleware = require("../helper/multerMiddleware");
const {
  getMenuSatuan,
  createMenuSatuan,
  updateMenuSatuan,
  deleteMenuSatuan,
} = require("../controllers/menuSatuanController.js");
const requireAuth = require("../middleware/requireAuth");
// authentication middleware
router.use(requireAuth);
// get all menuSatuan
router.get("/", getMenuSatuan);
// crete a new menuSatuan
router.post("/", multerMiddleware().single("image"), createMenuSatuan);
// update a menuSatuan
router.patch("/:id", multerMiddleware().single("image"), updateMenuSatuan);
// delete a menuSatuan
router.delete("/:id", deleteMenuSatuan);

module.exports = router;
