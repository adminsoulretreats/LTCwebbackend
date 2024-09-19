const { Schema, model } = require("mongoose");

const LogVnpaySchema = new Schema({
  ipAddr: { type: String },
  queryString: { type: String },
  createDate: { type: String },
  message: { type: String },
  type: { type: String },
});

const LogVnpay = model("logvnpay", LogVnpaySchema);

module.exports = {
  LogVnpay,
  LogVnpaySchema,
};
