const express = require("express");
const topicRouter = express.Router();

const { getAll, create, remove } = require("../controllers/topic.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

topicRouter.get("/", getAll);
topicRouter.post("/", authenticate, authorize(["admin"]), create);
topicRouter.post("/:id", authenticate, authorize(["admin"]), remove);

module.exports = {
  topicRouter,
};
