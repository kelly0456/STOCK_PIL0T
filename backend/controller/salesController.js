const Sale = require("../models/Sale");
const Product = require("../models/Product");

exports.getSales = async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
};

exports.createSale = async (req, res) => {

  const { items, total } = req.body;

  for (const item of items) {

    const product = await Product.findById(item.productId);

    product.stock -= item.qty;
    product.sold += item.qty;

    await product.save();
  }

  const sale = await Sale.create({
    items,
    total
  });

  res.status(201).json(sale);
};