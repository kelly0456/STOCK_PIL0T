const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);