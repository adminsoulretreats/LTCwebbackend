const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
  vnp_Amount: {
    type: String,
  },
  product: { type: Object },
  vnp_BankCode: { type: String },
  vnp_Command: { type: String },
  vnp_CreateDate: { type: String },
  vnp_CurrCode: { type: String },
  vnp_IpAddr: { type: String },
  vnp_Locale: { type: String },
  vnp_OrderInfo: { type: String },
  vnp_OrderType: {
    type: String,
  },
  vnp_ReturnUrl: { type: String },
  vnp_TmnCode: { type: String },
  vnp_TxnRef: { type: String },
  vnp_Version: { type: String },
  user_id: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to another collection (e.g., 'User')
  status: { type: String, default: "0" },
});

const Order = model("order", OrderSchema);

module.exports = {
  Order,
  OrderSchema,
};
