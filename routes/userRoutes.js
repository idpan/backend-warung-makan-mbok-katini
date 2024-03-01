const express = require("express");
const router = express.Router();
const {
  loginController,
  changePasswordController,
} = require("../controllers/userController");
// login route
router.post("/login", loginController);
router.patch("/change-password", changePasswordController);

module.exports = router;
