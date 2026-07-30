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

    // ===================================
    // Ensure user is authenticated
    // ===================================
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again.",
      });
    }

    const {
      items,
      paymentMethod,
      discount = 0,
      amountReceived = 0,
      phone = "",
      bankName = "",
      bankReference = "",
    } = req.body;

    // ===================================
    // Validate Cart
    // ===================================
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    let total = 0;
    const saleItems = [];

    // ===================================
    // Process Sale Items
    // ===================================
    for (const item of items) {

      const quantity = Number(item.quantity);

      if (
        !item.productId ||
        Number.isNaN(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid sale item quantity.",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const currentStock = Number(product.stock ?? 0);
      const currentSold = Number(product.sold ?? 0);

      if (Number.isNaN(currentStock) || Number.isNaN(currentSold)) {
        return res.status(500).json({
          success: false,
          message: "Product inventory data is invalid.",
        });
      }

      if (currentStock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) remaining.`,
        });
      }

      product.stock = currentStock - quantity;
      product.sold = currentSold + quantity;

      await product.save();

      const subtotal = product.price * quantity;

      total += subtotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        quantity,
        price: product.price,
        subtotal,
      });
    }

    // ===================================
    // Apply Discount
    // ===================================
    const finalTotal = Math.max(0, total - Number(discount));

    // ===================================
    // Cash Validation
    // ===================================
    if (
      paymentMethod === "Cash" &&
      Number(amountReceived) < finalTotal
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount received is less than the total.",
      });
    }

    // ===================================
    // Generate Invoice
    // ===================================
    const invoiceNumber =
      req.body.invoiceNumber || `INV-${Date.now()}`;

    // ===================================
    // Create Sale
    // ===================================
    const sale = await Sale.create({
      invoiceNumber,
      items: saleItems,
      total: finalTotal,
      discount: Number(discount),
      paymentMethod: paymentMethod || "Cash",
      paymentStatus:
        paymentMethod === "M-Pesa" ? "pending" : "paid",
      amountReceived: Number(amountReceived),
      phone,
      bankName,
      bankReference,
      soldBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Sale completed successfully.",
      sale,
    });

  } catch (error) {

    console.error("========== CREATE SALE ERROR ==========");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};