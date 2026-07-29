const Sale = require("../models/Sale");
const Product = require("../models/product"); // Change to "../models/Product" if your file is Product.js

// ===============================
// Get All Sales
// ===============================
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });

    res.status(200).json(sales);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ===============================
// Create Sale
// ===============================
exports.createSale = async (req, res) => {
  try {

    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items supplied.",
      });
    }

    for (const item of items) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found.`,
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} items remaining.`,
        });
      }

      product.stock -= item.qty;
      product.sold = (product.sold || 0) + item.qty;

      await product.save();
    }

    const sale = await Sale.create({
      items,
      total,
    });

    res.status(201).json({
      message: "Sale recorded successfully.",
      sale,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};