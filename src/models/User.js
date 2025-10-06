const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },

    password: { type: String },

    isConfirmed: { type: Boolean, default: false },
    confirmationToken: { type: String },
    confirmationTokenExpiry: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    ownerName: { type: String },
    gstin: { type: String },
    ownerEmail: { type: String },
    ownerPhone: { type: String },
    ownerPan: { type: String },
    ownerAddress: { type: String },

    bankAccount: {
      accountNumber: { type: String },
      holderName: { type: String },
      ifsc: { type: String },
      branch: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
