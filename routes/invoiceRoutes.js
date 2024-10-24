const express = require('express');
const { generateInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to generate invoice and return PDF (protected by JWT)
router.post('/generate', protect, generateInvoice);

module.exports = { router };
