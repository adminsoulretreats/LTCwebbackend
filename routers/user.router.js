const express = require("express");
const userRouter = express.Router();

// import controllers
const {
  getList,
  getDetail,
  create,
  remove,
  uploadAvatar,
  deleteAvatar,
  sendFormContact,
  updateWithRoleClient,
  updateWithRoleAdmin,
  // hello,
} = require("../controllers/user.controller");

// import middleware
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

const {
  uploadImageSingle,
} = require("../middlewares/upload/upload-image.middleware");

userRouter.get("/", authenticate, authorize(["admin"]), getList);

// userRouter.get("/testing-api", hello);

userRouter.get("/:id", getDetail);
userRouter.post(
  "/",
  authenticate,
  authorize(["admin"]),
  uploadImageSingle("avatar"),
  create
);

// update with client
userRouter.put("/client/:id", authenticate, updateWithRoleClient);

// update with admin
userRouter.put(
  "/admin/:id",
  authenticate,
  authorize(["admin"]),
  updateWithRoleAdmin
);

userRouter.delete("/:id", authenticate, authorize(["admin"]), remove);

userRouter.post(
  "/upload-avatar",
  authenticate,
  uploadImageSingle("avatar"),
  uploadAvatar
);

userRouter.post("/delete-avatar", authenticate, deleteAvatar);
userRouter.post("/send-form-contact", sendFormContact);

module.exports = {
  userRouter,
};
