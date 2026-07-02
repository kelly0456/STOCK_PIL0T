const Product = require("../models/Product");
const Sale = require("../models/Sale");

exports.getDashboard = async (req, res) => {

  const products = await Product.find();
  const sales = await Sale.find();

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + p.stock,
    0
  );

  const totalSold = products.reduce(
    (sum, p) => sum + p.sold,
    0
  );

  const dailyRevenue = sales.reduce(
    (sum, s) => sum + s.total,
    0
  );

  res.json({
    totalProducts,
    totalStock,
    totalSold,
    dailyRevenue
  });
};