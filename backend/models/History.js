const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  action: String,
  product: String,
  quantity: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("History", historySchema);