const { Schema, model } = require("mongoose");

const OrderDraftSchema = new Schema({
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
  status: { type: String, default: "pending" },
});

const OrderDraft = model("order_draft", OrderDraftSchema);

module.exports = {
  OrderDraft,
  OrderDraftSchema,
};
