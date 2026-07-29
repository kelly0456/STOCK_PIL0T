const router = require("express").Router();

const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");

router.get("/", getProducts);

router.post("/", addProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;