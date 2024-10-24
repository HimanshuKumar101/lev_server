const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      name: String,
      quantity: Number,
      rate: Number,
      total: Number,
      gst: Number,
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
