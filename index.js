const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require("./config/db");
const cookieParser = require('cookie-parser');

const { router: AuthRouter } = require('./routes/authRoutes');
const { router: InvoiceRouter } = require('./routes/invoiceRoutes'); // Include your invoice routes

dotenv.config();

// MongoDB connection
connectDB();
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/invoice', InvoiceRouter); // Add this line for invoice routes

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
