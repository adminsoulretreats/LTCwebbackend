const express = require("express");
const studentRouter = express.Router();

// import controllers
const {
  getListStudent,
  createStudent,
  createArrayStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

// import middleware
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

const {
  uploadImageSingle,
} = require("../middlewares/upload/upload-image.middleware");

studentRouter.get("/", authenticate, authorize(["admin"]), getListStudent);
studentRouter.post(
  "/create/",
  authenticate,
  authorize(["admin"]),
  createStudent
);

studentRouter.post(
  "/create-array/",
  authenticate,
  authorize(["admin"]),
  createArrayStudent
);

studentRouter.put(
  "/update/:id",
  authenticate,
  authorize(["admin"]),
  updateStudent
);
studentRouter.delete(
  "/delete/:id",
  authenticate,
  authorize(["admin"]),
  deleteStudent
);
module.exports = {
  studentRouter,
};
