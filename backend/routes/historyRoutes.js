const express = require("express");
const router = express.Router();

const {
  getHistory,
} = require("../controller/historyController");

router.get("/", getHistory);

module.exports = router;