const express = require("express");
const authRouter = express.Router();

// import controllers
const {
  signIn,
  signUp,
  changePassword,
  forgotPassword,
  verifyForgotPassword,
  verifySignUp,
  fetchWithToken,
  addToSheet,
} = require("../controllers/auth.controller");

// Đăng nhập
authRouter.post("/sign-in", signIn);

// Đăng ký
authRouter.post("/sign-up", signUp);

// Xác thực đăng ký
authRouter.post("/verify-sign-up", verifySignUp);

// Đổi mật khẩu
authRouter.post("/change-password", changePassword);

// quên mật khẩu
authRouter.post("/forgot-password", forgotPassword);

// Xác thực quên mật khẩu
authRouter.post("/verify-forgot-password", verifyForgotPassword);

// Fecth user with token
authRouter.post("/fetch-with-token", fetchWithToken);

authRouter.post("/add-to-sheet", addToSheet);

module.exports = {
  authRouter,
};
