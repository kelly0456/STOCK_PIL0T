const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const saleSchema = new mongoose.Schema(
  {
    items: {
      type: [saleItemSchema],
      required: true,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "M-Pesa", "Card"],
      default: "Cash",
    },

    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", saleSchema);