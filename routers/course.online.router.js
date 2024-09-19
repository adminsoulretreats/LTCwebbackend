const express = require("express");
const courseOnlineRouter = express.Router();

// import controllers
const {
  getDetailCourseOnline,
  getListCourseOnline,
  createCourseOnline,
  createArrayCourseOnline,
  updateCourseOnline,
  deleteCourseOnline,
} = require("../controllers/course.online.controller");

// import middleware
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

const {
  uploadImageSingle,
} = require("../middlewares/upload/upload-image.middleware");

courseOnlineRouter.get("/detail/:_id", getDetailCourseOnline);

courseOnlineRouter.get(
  "/",
  authenticate,
  authorize(["admin"]),
  getListCourseOnline
);
courseOnlineRouter.post(
  "/create/",
  authenticate,
  authorize(["admin"]),
  createCourseOnline
);

courseOnlineRouter.post(
  "/create-array/",
  authenticate,
  authorize(["admin"]),
  createArrayCourseOnline
);
courseOnlineRouter.delete(
  "/delete/:_id",
  authenticate,
  authorize(["admin"]),
  deleteCourseOnline
);

courseOnlineRouter.put(
  "/update/:_id",
  authenticate,
  authorize(["admin"]),
  updateCourseOnline
);

module.exports = {
  courseOnlineRouter,
};
