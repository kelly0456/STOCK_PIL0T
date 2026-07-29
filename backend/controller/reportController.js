const Sale = require("../models/Sale");

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