const express = require("express");
const productRouter = express.Router();

// Controller
const {
  getAll,
  getDetail,
  create,
  edit,
  remove,
} = require("../controllers/product.controller");

const {
  uploadImageMultiple,
} = require("../middlewares/upload/upload-image.middleware");

// Get ALL product list
productRouter.get("/", getAll);

// Get Product Detail
productRouter.get("/:id", getDetail);

// Create new product
productRouter.post("/", uploadImageMultiple("productImage", 10), create);

// Edit product by ID
productRouter.put("/:id", edit);

// Delete product by ID
productRouter.delete("/:id", remove);

module.exports = {
  productRouter,
};
