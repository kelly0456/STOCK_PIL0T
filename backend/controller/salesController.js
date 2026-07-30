const Sale = require("../models/Sale");
const Product = require("../models/product");

// =======================================
// Get All Sales
// =======================================
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("soldBy", "fullname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      sales,
    });

  } catch (error) {
    console.error("========== GET SALES ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Create Sale
// =======================================
exports.createSale = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No sale items supplied.",
      });
    }

    let total = 0;
    const saleItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Each item must contain productId and quantity.",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) remaining.`,
        });
      }

      // Update stock
      product.stock -= item.quantity;
      product.sold += item.quantity;

      await product.save();

      const subtotal = product.price * item.quantity;
      total += subtotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    const invoiceNumber = `INV-${Date.now()}`;

    const sale = await Sale.create({
      invoiceNumber,
      items: saleItems,
      total,
      paymentMethod: paymentMethod || "Cash",
      soldBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Sale recorded successfully.",
      sale,
    });

  } catch (error) {
    console.error("========== CREATE SALE ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};