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

    const {
      name,
      price,
      stock,
      category,
      sold,
    } = req.body;

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      sold: sold || 0,

      // Cloudinary Image URL
      image: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Update Product
// ===============================
exports.updateProduct = async (req, res) => {
  try {

    const updateData = {
      ...req.body,
    };

    // If a new image is uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully.",
      product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Delete Product
// ===============================
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};