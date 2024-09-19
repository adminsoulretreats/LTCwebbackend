const express = require("express");
const categoryRouter = express.Router();

const {
  create,
  getAll,
  remove,
  edit,
} = require("../controllers/category.controller");

categoryRouter.post("/", create);
categoryRouter.get("/", getAll);
categoryRouter.delete("/:id", remove);
categoryRouter.put("/:id", edit);

module.exports = {
  categoryRouter,
};
