const express = require("express");
const rootRouter = express.Router();

// import Router
const { userRouter } = require("./user.router");
const { authRouter } = require("./auth.router");
const { categoryRouter } = require("./category.router");
const { productRouter } = require("./product.router");
const { topicRouter } = require("./topic.router");
const { blogRouter } = require("./blog.router");
const { studentRouter } = require("./student.router");
const { courseRouter } = require("./course.router");
const { courseOnlineRouter } = require("./course.online.router");
const {
  scheduleCourseOnlineRouter,
} = require("./schedule.course.online.router");
const { questionRouter } = require("./question.router");
const { videoRouter } = require("./video.router");
const { orderRouter } = require("./order.router");
const { logvnpayRouter } = require("./logvnpay.router");
rootRouter.use("/users", userRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("/product", productRouter);
rootRouter.use("/topic", topicRouter);
rootRouter.use("/blog", blogRouter);
rootRouter.use("/student", studentRouter);
rootRouter.use("/course", courseRouter);
rootRouter.use("/course-online", courseOnlineRouter);
rootRouter.use("/schedule-course-online", scheduleCourseOnlineRouter);
rootRouter.use("/question", questionRouter);
rootRouter.use("/video", videoRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/logvnpay", logvnpayRouter);
rootRouter.get("/demo", (req, res) => {
  return res.send({
    status: "success",
    data: "Thành công",
  });
});

module.exports = {
  rootRouter,
};
