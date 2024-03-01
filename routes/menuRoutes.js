const express = require("express");
const router = express.Router();
const {
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");
const requireAuth = require("../middleware/requireAuth");
// authentication middleware
router.use(requireAuth);
// get all menu
router.get("/", getMenu);
// crete a new menu
router.post("/", createMenu);
// update a menu
router.patch("/:id", updateMenu);
// delete a menu
router.delete("/:id", deleteMenu);

module.exports = router;
