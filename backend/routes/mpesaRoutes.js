const router = require("express").Router();

const {
  getAccessToken,
} = require("../controller/mpesaController");

router.get("/token", getAccessToken);

module.exports = router;