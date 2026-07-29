const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    items: [
      {
        product: String,
        quantity: Number,
        price: Number,
      },
    ],
    paymentMethod: {
      type: String,
      default: "Cash",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", historySchema);