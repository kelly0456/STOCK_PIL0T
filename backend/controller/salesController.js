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
    const {
      items,
      paymentMethod,
      discount = 0,
      amountReceived = 0,
      phone = "",
      bankName = "",
      bankReference = "",
    } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No sale items supplied.",
      });
    }

    let total = 0;
    const saleItems = [];

    // ============================
    // Process each item
    // ============================
    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!item.productId || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each item must contain a valid productId and quantity.",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const currentStock = Number(product.stock || 0);
      const currentSold = Number(product.sold || 0);

      if (currentStock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${currentStock} item(s) remaining.`,
        });
      }

      // Update stock and sold
      product.stock = currentStock - quantity;
      product.sold = currentSold + quantity;

      await product.save();

      const subtotal = Number(product.price) * quantity;
      total += subtotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        subtotal,
      });
    }

    // Apply discount
    const finalTotal = total - Number(discount || 0);

    // Create invoice
    const invoiceNumber = `INV-${Date.now()}`;

    const sale = await Sale.create({
      invoiceNumber,
      items: saleItems,
      total: finalTotal,
      discount: Number(discount),
      paymentMethod: paymentMethod || "Cash",
      amountReceived: Number(amountReceived),
      phone,
      bankName,
      bankReference,
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