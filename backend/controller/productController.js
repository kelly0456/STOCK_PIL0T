const Product = require("../models/product");

// ===============================
// Get All Products
// ===============================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Add Product
// ===============================
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Product
// ===============================
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Delete Product
// ===============================
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};