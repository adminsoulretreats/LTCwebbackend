const express = require("express");
const courseRouter = express.Router();

// import controllers
const {
  getListCourse,
  createCourse,
  createArrayCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

// import middleware
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

const {
  uploadImageSingle,
} = require("../middlewares/upload/upload-image.middleware");

courseRouter.get("/", authenticate, authorize(["admin"]), getListCourse);
courseRouter.post("/create/", authenticate, authorize(["admin"]), createCourse);

courseRouter.post(
  "/create-array/",
  authenticate,
  authorize(["admin"]),
  createArrayCourse
);

courseRouter.put(
  "/update/:id",
  authenticate,
  authorize(["admin"]),
  updateCourse
);
courseRouter.delete(
  "/delete/:id",
  authenticate,
  authorize(["admin"]),
  deleteCourse
);
module.exports = {
  courseRouter,
};
