const Invoice = require('../models/Invoice');
const puppeteer = require('puppeteer');

const generateInvoice = async (req, res) => {
  const { products } = req.body;

  try {
    // Save the invoice data in the database
    const invoice = await Invoice.create({
      userId: req.user._id,
      products,
    });

    // Use Puppeteer to generate the PDF
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // HTML structure for the invoice
    const invoiceHTML = `
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #FFFFFF;
    }
    .container {
      width: 595px;
      height: 737px;
      margin: 20px auto;
      background: #FFFFFF;
      padding: 20px;
      
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      background: #0A0A0A;
      color: white;
    }
    .title {
      width: 167px;
      height: 25px;
      font-family: Inter, sans-serif;
      font-size: 16px;
      font-weight: 600;
      text-align: right;
      line-height: 24.11px;
    }
    .company-info {
      text-align: left;
      background-color: #333333;
      opacity: 0.6;
      font-family: Inter, sans-serif;
      font-size: 10px;
      font-weight: 500;
      line-height: 11.42px;
    }
    .company-name {
      font-family: Pretendard, sans-serif;
      font-size: 17.31px;
      font-weight: 300;
      background-color: #000000;
      color: white;
    }
    .company-address {
      font-family: Pretendard, sans-serif;
      font-size: 6.49px;
      font-weight: 300;
      background-color: #000000;
      color: white;
    }
    .logo {
      width: 114.87px;
      height: 36.92px;
      background-color: #000000;
      margin-left: auto;
    }
    .invoice-section {
      background-color: #CCCCCC;
      border-radius: 10px;
      margin: 20px 0;
      padding: 20px;
    }
    .traveller-name {
      font-family: Rubik, sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 14.22px;
      text-align: right;
    }
    .user-name {
      font-family: Rubik, sans-serif;
      font-size: 16px;
      font-weight: 400;
      background-color: #CCF575;
      line-height: 18.96px;
      text-align: right;
    }
    .user-email {
      font-family: Rubik, sans-serif;
      font-size: 12px;
      font-weight: 400;
      background-color: #FFFFFF;
      line-height: 14.22px;
      text-align: right;
    }
    .date {
      font-family: Rubik, sans-serif;
      font-size: 12px;
      font-weight: 400;
      background-color: #DDDDDD;
      line-height: 14.22px;
      text-align: right;
    }
    .product-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: linear-gradient(90.77deg, #303661 10.65%, #263406 114.19%);
      border-radius: 78px 0px 0px 0px;
    }
    .product-table th, .product-table td {
      border: 1px solid #A2A2A2;
      padding: 8px;
      font-family: Inter, sans-serif;
      font-size: 10px;
      font-weight: 500;
      text-align: left;
      background-color: #FFFFFF;
    }
    .total-section {
      margin-top: 20px;
      background: #FFFFFF;
      border: 1px solid #A2A2A2;
      padding: 11.87px;
      border-radius: 8px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-family: Inter, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 13.39px;
      background-color: #FFFFFF;
    }
    .footer {
      margin-top: 50px;
      padding: 10px 30px;
      background: #272833;
      border-radius: 40px 0 0 0;
      text-align: left;
      font-family: Inter, sans-serif;
      font-size: 8.37px;
      font-weight: 500;
      line-height: 13.39px;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="navbar">
      <div class="title">INVOICE GENERATOR</div>
      <div class="logo">
        <!-- Placeholder for logo -->
         <svg
          width="39"
          height="39"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[39px] h-[39px]"
        >
          <path
            d="M39.5 20L30 39.5H25.5H10.3038L6.03038 31L0.5 20L10 0.5H14.5H30L34.141 9L39.5 20Z"
            fill="white"
          />
          <path
            d="M25.5 31L31 20L25.5 9L34.5 20L25.5 31Z"
            fill="black"
          />
          <path
            d="M13 11L14.5 9L9 20L14.5 31L6 20L13 11Z"
            fill="black"
          />
        </svg>
      </div>
      <div class="company-info">
        <div class="company-name">Infotech</div>
        <div class="company-address">example@gmail.com</div>
      </div>
    </div>

    <div class="invoice-section">
      <div class="traveller-name">Traveller Name:</div>
      <div class="user-name">${req.user.name}</div>
      <div class="user-email">${req.user.email}</div>
      <div class="date">${new Date().toLocaleDateString()}</div>
    </div>

    <table class="product-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Total</th>
          <th>GST (18%)</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (product) => `
            <tr>
              <td>${product.name}</td>
              <td>${product.quantity}</td>
              <td>₹${product.rate}</td>
              <td>₹${product.total}</td>
              <td>₹${parseFloat(product.gst).toFixed(2)}</td>
            </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-row">
        <div>Total Charges</div>
        <div>₹${products
          .reduce((sum, product) => sum + parseFloat(product.total), 0)
          .toFixed(2)}</div>
      </div>
      <div class="total-row">
  <div>GST (18%)</div>
  <div>₹${products.reduce((sum, product) => sum + parseFloat(product.gst), 0).toFixed(2)}</div>
</div>

      <div class="total-row">
        <div>Total Amount</div>
        <div>₹${products
          .reduce((sum, product) => sum + parseFloat(product.totalPriceWithGST), 0)
          .toFixed(2)}</div>
      </div>
    </div>

    <div class="footer">
      <p>We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.</p>
    </div>
  </div>
</body>
</html>
`;

    // Set the HTML content and generate the PDF
    await page.setContent(invoiceHTML, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    if (!pdfBuffer) {
      throw new Error('Failed to generate PDF');
    }

    // Close Puppeteer
    await browser.close();

    // Return the generated PDF as response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="invoice.pdf"',
      'Content-Length': pdfBuffer.length, // Set content length
    });

    // Send the binary PDF data
    res.end(pdfBuffer, 'binary'); // Ensure binary transfer
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
};

module.exports = { generateInvoice };

