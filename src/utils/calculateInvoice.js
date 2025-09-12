function recalculateInvoice(invoice) {
  invoice.items = invoice.items.map(item => ({
    ...item.toObject ? item.toObject() : item,
    amount: item.quantity * item.rate
  }));

  const subtotal = invoice.items.reduce((sum, i) => sum + i.amount, 0);

  const tax_amount = subtotal * (invoice.tax_rate || 0) / 100;
  const total = subtotal + tax_amount - (invoice.discount || 0);

  invoice.subtotal = subtotal;
  invoice.tax_amount = tax_amount;
  invoice.total = total < 0 ? 0 : total ;

  return invoice;
}

module.exports = recalculateInvoice;
