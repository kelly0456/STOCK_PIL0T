const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.addProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};