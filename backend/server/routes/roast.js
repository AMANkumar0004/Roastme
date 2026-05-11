const express = require("express");
const router = express.Router();
const {
  createRoast,
  getHistory,
  getRecent,
  getRoastById,
} = require("../controllers/roastController.js");

router.post("/", createRoast);
router.get("/history", getHistory);
router.get("/recent", getRecent);
router.get("/:id", getRoastById);

module.exports = router;