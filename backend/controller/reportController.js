const Sale = require("../models/Sale");
const Product = require("../models/product");

// =======================================
// Dashboard Report
// =======================================
exports.getDashboardReport = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const sales = await Sale.find();

    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, product) => sum + (product.stock || 0),
      0
    );

    const totalSold = products.reduce(
      (sum, product) => sum + (product.sold || 0),
      0
    );

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (sale.total || 0),
      0
    );

    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 15
    );

    const outOfStock = products.filter(
      (product) => product.stock === 0
    );

    const topSelling = [...products]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      totalProducts,
      totalStock,
      totalSold,
      totalRevenue,
      products,
      lowStock,
      outOfStock,
      topSelling,
    });

  } catch (error) {
    console.error("========== DASHBOARD REPORT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Monthly Report
// =======================================
exports.getMonthlyReport = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: {
            $sum: 1,
          },
          totalIncome: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    return res.status(200).json(report);

  } catch (error) {
    console.error("========== MONTHLY REPORT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Yearly Report
// =======================================
exports.getYearlyReport = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          totalSales: {
            $sum: 1,
          },
          totalIncome: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
        },
      },
    ]);

    return res.status(200).json(report);

  } catch (error) {
    console.error("========== YEARLY REPORT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};