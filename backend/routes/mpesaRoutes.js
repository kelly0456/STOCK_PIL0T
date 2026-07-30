const router = require("express").Router();

const {
  getAccessToken,
  stkPush,
  mpesaCallback,
} = require("../controller/mpesaController");

router.get("/token", getAccessToken);
router.post("/stk", stkPush);
router.post("/callback", mpesaCallback);

module.exports = router;