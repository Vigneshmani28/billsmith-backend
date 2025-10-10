const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: false },
});

const invoiceSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invoice_number: { type: String, required: true },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // enforce YYYY-MM-DD format
    },

    // ✅ New From Fields
    from_name: String,
    from_email: String,
    from_address: String,
    from_phone: String,
    from_gstin: String,
    from_pan: String,

    // ✅ New To Fields
    to_name: String,
    to_email: String,
    to_address: String,
    to_phone: String,
    to_gstin: String,
    to_pan: String,

    // ✅ Inter-state flag
    is_inter_state: { type: Boolean, default: false },

    // Financial Fields
    status: { type: String, default: "unpaid" },
    items: [invoiceItemSchema],
    tax_rate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    public_id: { type: String, unique: true, default: () => new mongoose.Types.ObjectId() },
    is_public: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
