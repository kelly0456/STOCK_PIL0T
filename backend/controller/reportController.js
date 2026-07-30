const Sale = require("../models/Sale");
const Product = require("../models/product");

// ===============================
// Dashboard Report
// ===============================
exports.getDashboardReport = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const sales = await Sale.find();

    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );

    const totalSold = products.reduce(
      (sum, product) => sum + product.sold,
      0
    );

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.total,
      0
    );

    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 15
    );

    const outOfStock = products.filter(
      (product) => product.stock === 0
    );

    const topSelling = [...products]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    res.json({
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
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Monthly Report
// ===============================
exports.getMonthlyReport = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalIncome: {
            $sum: "$total",
          },
          totalSales: {
            $sum: 1,
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

    res.json(report);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Yearly Report
// ===============================
exports.getYearlyReport = async (req, res) => {
  try {
    const report = await Sale.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          totalIncome: {
            $sum: "$total",
          },
          totalSales: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": -1,
        },
      },
    ]);

    res.json(report);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};