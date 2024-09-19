const express = require("express");
const {
  createLogvnpay,
  getLogvnpay,
} = require("../controllers/logvnpay.controller");
const logvnpayRouter = express.Router();

logvnpayRouter.post("/create/", createLogvnpay);

logvnpayRouter.get("/", getLogvnpay);
module.exports = {
  logvnpayRouter,
};
