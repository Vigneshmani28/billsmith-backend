const mongoose = require('mongoose');

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
  match: /^\d{4}-\d{2}-\d{2}$/, // Enforce YYYY-MM-DD format
},
    from_name: String,
    from_email: String,
    to_name: String,
    to_email: String,
    to_address: String,
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