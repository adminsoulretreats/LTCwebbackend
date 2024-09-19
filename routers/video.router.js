const express = require("express");
const videoRouter = express.Router();

const {
  getListVideo,
  getVideoDetail,
  createVideo,
  deleteVideo,
  editVideo,
} = require("../controllers/video.controller");

// import middleware
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

videoRouter.get("/", authenticate, authorize(["admin"]), getListVideo);

videoRouter.get(
  "/details/",
  authenticate,
  authorize(["admin"]),
  getVideoDetail
);

videoRouter.post("/create/", authenticate, authorize(["admin"]), createVideo);
videoRouter.delete(
  "/delete/:_id",
  authenticate,
  authorize(["admin"]),
  deleteVideo
);
videoRouter.put("/update/:_id", authenticate, authorize(["admin"]), editVideo);
module.exports = {
  videoRouter,
};
