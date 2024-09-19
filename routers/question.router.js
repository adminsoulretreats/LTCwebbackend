const express = require("express");
const questionRouter = express.Router();

const {
  getListQuestion,
  createQuestion,
  deleteQuestion,
  editQuestion,
} = require("../controllers/question.controller");

// import middleware
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

questionRouter.get("/", authenticate, authorize(["admin"]), getListQuestion);
questionRouter.post(
  "/create/",
  authenticate,
  authorize(["admin"]),
  createQuestion
);
questionRouter.delete(
  "/delete/:_id",
  authenticate,
  authorize(["admin"]),
  deleteQuestion
);
questionRouter.put(
  "/update/:_id",
  authenticate,
  authorize(["admin"]),
  editQuestion
);
module.exports = {
  questionRouter,
};
