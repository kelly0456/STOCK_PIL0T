const Sale = require("../models/Sale");
const Product = require("../models/product");

// ===============================
// Get All Sales
// ===============================
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("soldBy", "fullname email")
      .sort({ createdAt: -1 });

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

    const { items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items supplied.",
      });
    }

    let total = 0;
    const saleItems = [];

    for (const item of items) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `${item.name || "Product"} not found.`,
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} item(s) remaining.`,
        });
      }

      // Update stock
      product.stock -= item.qty;
      product.sold += item.qty;

      await product.save();

      const subtotal = product.price * item.qty;
      total += subtotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.qty,
        subtotal,
      });
    }

    // Generate Invoice Number
    const invoiceNumber = `INV-${Date.now()}`;

    const sale = await Sale.create({
      invoiceNumber,
      items: saleItems,
      total,
      paymentMethod: paymentMethod || "Cash",
      soldBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Sale recorded successfully.",
      sale,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};