const router = require("express").Router();

const upload = require("../middleware/upload");

const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");

// ==========================
// GET ALL PRODUCTS
// ==========================
router.get("/", getProducts);

// ==========================
// ADD PRODUCT + UPLOAD IMAGE
// ==========================
router.post(
  "/",
  upload.single("image"),
  addProduct
);

// ==========================
// UPDATE PRODUCT
// ==========================
router.put("/:id", updateProduct);

// ==========================
// DELETE PRODUCT
// ==========================
router.delete("/:id", deleteProduct);

module.exports = router;