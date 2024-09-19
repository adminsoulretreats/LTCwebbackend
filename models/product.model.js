const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: String,
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    rating: Number, //Rating star allow 1 - 10
    status: {
      type: String,
      default: "inStock", // Have 3 status: inStock, outOfStock, lowStock. Default is inStock
    },
    amount: Number, //Number of items inb stock
    price: Number, //Price of items
    imgSrc: [String], //Array string image url
    description: String,
  },
  {
    timestampsL: Date,
  }
);

const Product = model("Product", ProductSchema);

module.exports = {
  ProductSchema,
  Product,
};
