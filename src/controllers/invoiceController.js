const Invoice = require('../models/Invoice');
const recalc = require('../utils/calculateInvoice');
const {mapInvoice} = require('../utils/mapInvoice');

// ---------------- CREATE INVOICE ----------------
exports.createInvoice = async (req, res, next) => {
  try {
    // Extract invoice data from request body
    let invoiceData = { ...req.body, user_id: req.user.id };

    // 🧮 Compute inter-state status
    const fromGstin = invoiceData.from_gstin || "";
    const toGstin = invoiceData.to_gstin || "";

    const isInterState =
      fromGstin.length >= 2 && toGstin.length >= 2
        ? fromGstin.substring(0, 2) !== toGstin.substring(0, 2)
        : false;

    invoiceData.is_inter_state = isInterState;

    // Create Invoice Object
    let invoice = new Invoice(invoiceData);

    // Recalculate amounts (assuming you have a recalc function)
    invoice = recalc(invoice);

    // Save Invoice
    await invoice.save();

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};


// ---------------- PUT FULL INVOICE ----------------
exports.putInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Extract data from frontend
    let invoiceData = { ...req.body };

    // 🧮 Compute inter-state status
    const fromGstin = invoiceData.from_gstin || "";
    const toGstin = invoiceData.to_gstin || "";

    const isInterState =
      fromGstin.length >= 2 && toGstin.length >= 2
        ? fromGstin.substring(0, 2) !== toGstin.substring(0, 2)
        : false;

    invoiceData.is_inter_state = isInterState;

    // 📝 Update the invoice with new data
    let invoice = await Invoice.findByIdAndUpdate(
      id,
      invoiceData,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // 🔄 Recalculate totals after update
    invoice = recalc(invoice);
    await invoice.save();

    res.json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};



// ---------------- PATCH FULL INVOICE ----------------
exports.patchInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    Object.keys(req.body).forEach(key => invoice[key] = req.body[key]);

    // Recalculate totals
    recalc(invoice);

    await invoice.save();
    res.json({ success: true, message: "Invoice updated" });
  } catch (error) {
    next(error);
  }
};

// ---------------- PATCH SINGLE ITEM ----------------
exports.updateInvoiceItem = async (req, res, next) => {
  try {
    const { invoiceId, itemId } = req.params;
    const updates = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    const item = invoice.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    Object.keys(updates).forEach(key => item[key] = updates[key]);

    // Recalculate totals
    recalc(invoice);

    await invoice.save();
    res.json({ success: true, message: "Invoice updated" });
  } catch (error) {
    next(error);
  }
};

// ---------------- DELETE SINGLE ITEM ----------------
exports.deleteInvoiceItem = async (req, res, next) => {
  try {
    const { invoiceId, itemId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    // Filter out the item
    const itemIndex = invoice.items.findIndex(i => i._id.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Item not found" });

    invoice.items.splice(itemIndex, 1); // remove the item

    // Recalculate totals
    recalc(invoice);

    await invoice.save();
    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};


// ---------------- DELETE PARTICULAR INVOICE ----------------
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    next(error);
  }
};

// ---------------- ADD SINGLE ITEM ----------------
exports.addInvoiceItem = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const newItem = req.body; // { description, quantity, rate }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    // Add new item
    invoice.items.push({
      ...newItem,
      amount: newItem.quantity * newItem.rate // calculate amount for the new item
    });

    // Recalculate totals
    recalc(invoice);

    await invoice.save();
    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};


// Get invoice by ID
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice)
      return res.status(404).json({ success: false, message: "Invoice not found" });

    recalc(invoice);

    const mappedInvoice = mapInvoice(invoice, { withItems: true });

    res.json({ success: true, data: mappedInvoice });
  } catch (error) {
    next(error);
  }
};


// Get invoice by ID
exports.getInvoiceByPublicId = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ public_id: req.params.publicId }).lean();

        if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
        recalc(invoice);
        const mappedInvoice = mapInvoice(invoice, { withItems: true });
        res.json({ success: true, data: mappedInvoice });
    } catch (error) {
        next(error);
  }
};

// Get all invoices for user
exports.getUserInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .lean();

    const mappedInvoices = invoices.map((inv) => ({
      ...inv,
      id: inv._id.toString(),
    }));

    mappedInvoices.forEach((inv) => delete inv._id);

    res.json({ success: true, data: mappedInvoices });
  } catch (error) {
    next(error);
  }
};

