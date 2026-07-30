const mongoose = require("mongoose");

// =======================================
// Sale Item Schema
// =======================================
const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  name: {
    type: String,
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

  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

// =======================================
// Sale Schema
// =======================================
const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [saleItemSchema],
      required: true,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "M-Pesa", "Bank"],
      default: "Cash",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },

    checkoutRequestId: {
      type: String,
      default: "",
    },

    amountReceived: {
      type: Number,
      default: 0,
    },

    phone: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },

    bankReference: {
      type: String,
      default: "",
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