const express = require('express');
const {createInvoice, getUserInvoices,getInvoiceById, patchInvoice, updateInvoiceItem, deleteInvoiceItem, deleteInvoice, addInvoiceItem,putInvoice, getInvoiceByPublicId } = require('../controllers/invoiceController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/")
    .post(authMiddleware, createInvoice)
    .get(authMiddleware, getUserInvoices);

router.route("/:id")
    .get(authMiddleware, getInvoiceById)
    .patch(authMiddleware, patchInvoice)
    .put(authMiddleware, putInvoice )
    .delete(authMiddleware, deleteInvoice);

router.route("/public/:publicId")
    .get(getInvoiceByPublicId)

router.route("/:invoiceId/items")
    .post(authMiddleware, addInvoiceItem)

router.route("/:invoiceId/items/:itemId")
    .patch(authMiddleware, updateInvoiceItem)
    .delete(authMiddleware, deleteInvoiceItem)


module.exports = router;