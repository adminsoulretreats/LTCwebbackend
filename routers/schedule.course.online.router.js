const express = require("express");
const scheduleCourseOnlineRouter = express.Router();

const {
  getListScheduleCourseOnline,
  getDetailScheduleCourseOnline,
  createScheduleCourseOnline,
  deleteScheduleCourseOnline,
  editScheduleCourseOnline,
  editScheduleCourseOnlineHandleUser,
  editScheduleCourseOnlineHandleUserChangePermission,
  editScheduleCourseOnlineHandleAddUserToSchedule,
  editScheduleCourseOnlineHandleDelUserFromSchedule,
  editScheduleCourseOnlineHandleUserAnswerQuestion,
  scheduleCourseOnlineSendEmailAfterAnswer,
} = require("../controllers/schedule.course.online.controller");

// import middleware
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middleware");

scheduleCourseOnlineRouter.get(
  "/",
  authenticate,
  authorize(["admin"]),
  getListScheduleCourseOnline
);
scheduleCourseOnlineRouter.get(
  "/detail/:_id",
  // authenticate,
  // authorize(["admin"]),
  getDetailScheduleCourseOnline
);
scheduleCourseOnlineRouter.post(
  "/create/",
  authenticate,
  authorize(["admin"]),
  createScheduleCourseOnline
);
scheduleCourseOnlineRouter.delete(
  "/delete/:_id",
  authenticate,
  authorize(["admin"]),
  deleteScheduleCourseOnline
);
scheduleCourseOnlineRouter.put(
  "/update/:_id",
  authenticate,
  authorize(["admin"]),
  editScheduleCourseOnline
);
scheduleCourseOnlineRouter.put(
  "/handle-user/:_id",
  authenticate,
  authorize(["admin"]),
  editScheduleCourseOnlineHandleUser
);

scheduleCourseOnlineRouter.put(
  "/handle-user-change-permission/:_id",
  authenticate,
  authorize(["admin"]),
  editScheduleCourseOnlineHandleUserChangePermission
);

scheduleCourseOnlineRouter.put(
  "/handle-add-user-to-schedule/:_id",
  authenticate,
  authorize(["admin"]),
  editScheduleCourseOnlineHandleAddUserToSchedule
);
scheduleCourseOnlineRouter.put(
  "/handle-del-user-from-schedule/:_id",
  authenticate,
  authorize(["admin"]),
  editScheduleCourseOnlineHandleDelUserFromSchedule
);

scheduleCourseOnlineRouter.put(
  "/handle-user-answer-question/:_id",
  authenticate,
  editScheduleCourseOnlineHandleUserAnswerQuestion
);
scheduleCourseOnlineRouter.post(
  "/send-email-after-answer/",
  authenticate,
  scheduleCourseOnlineSendEmailAfterAnswer
);

module.exports = {
  scheduleCourseOnlineRouter,
};
