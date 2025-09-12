function mapInvoice(invoice, { withItems = false } = {}) {
  if (!invoice) return null;

  const mapped = {
    ...invoice,
    id: invoice._id.toString(),
  };

  delete mapped._id;

  if (withItems && Array.isArray(invoice.items)) {
    mapped.items = invoice.items.map((item) => {
      const mappedItem = {
        ...item,
        id: item._id.toString(),
      };
      delete mappedItem._id;
      return mappedItem;
    });
  }

  return mapped;
}

module.exports = { mapInvoice };
