const express = require("express");
const router = express.Router();
const {
  getContact,
  updateContact,
} = require("../controllers/contactController");
const requireAuth = require("../middleware/requireAuth");

// authentication middleware
router.use(requireAuth);
// get contact
router.get("/", getContact);
// update contact
router.patch("/:id", updateContact);

module.exports = router;
