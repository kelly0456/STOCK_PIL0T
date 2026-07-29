const History = require("../models/History");

exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};