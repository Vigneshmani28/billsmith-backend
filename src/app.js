const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const userRoute = require('./routes/userRoute');
const invoiceRoute = require('./routes/invoiceRoute');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://172.31.1.43:3000'],
  credentials: true
}));

app.use("/api/user", userRoute);
app.use("/api/invoices", invoiceRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});

app.use(errorHandler);

module.exports = app;