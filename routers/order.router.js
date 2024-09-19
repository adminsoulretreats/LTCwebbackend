const express = require("express");
const orderRouter = express.Router();

// Controller
const {
  createPaymentUrl,
  vnpay_return,
  vnpay_ipn,
  getOrderDetails,
} = require("../controllers/order.controller");
const {
  ipWhitelistMiddleware,
} = require("../middlewares/auth/verify-token.middleware");

orderRouter.get("/details", getOrderDetails);
orderRouter.get("/create_payment_url", createPaymentUrl);
orderRouter.get("/vnpay_ipn", ipWhitelistMiddleware, vnpay_ipn);
orderRouter.get("/vnpay_return", vnpay_return);
module.exports = {
  orderRouter,
};
