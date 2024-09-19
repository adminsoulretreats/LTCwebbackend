const { CourseOnline } = require("../models/course.online.model");
const crypto = require("crypto");
var ObjectID = require("mongodb").ObjectID;

const getDetailCourseOnline = async (req, res) => {
  console.log("getDetailCourseOnline");
  try {
    const { _id } = req.params;

    const query = [
      {
        $match: { _id: ObjectID(_id) },
      },
      {
        $unwind: "$lesson",
      },
      {
        $unwind: "$lesson.videoList",
      },
      {
        $addFields: {
          "lesson.videoList.videoObjectId": {
            $toObjectId: "$lesson.videoList._id",
          },
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "lesson.videoList.videoObjectId",
          foreignField: "_id",
          as: "lesson.videoListDetails",
        },
      },
      {
        $unwind: "$lesson.videoListDetails",
      },
      {
        $group: {
          _id: {
            courseId: "$_id",
            lessonTitle: "$lesson.title",
            lessonPhase: "$lesson.phase",
            lessonPermission: "$lesson.permission",
            lessonTotalTime: "$lesson.totalTime",
            lessonIsView: "$lesson.isView",
            lessonPrice: "$lesson.price",
          },
          name: { $first: "$name" },
          title: { $first: "$title" },
          description: { $first: "$description" },
          content: { $first: "$content" },
          totalStudent: { $first: "$totalStudent" },
          totalPrice: { $first: "$totalPrice" },
          promoPrice: { $first: "$promoPrice" },
          videoList: { $push: "$lesson.videoListDetails" },
        },
      },
      {
        $group: {
          _id: {
            courseId: "$_id.courseId",
          },
          name: { $first: "$name" },
          title: { $first: "$title" },
          description: { $first: "$description" },
          content: { $first: "$content" },
          totalStudent: { $first: "$totalStudent" },
          totalPrice: { $first: "$totalPrice" },
          promoPrice: { $first: "$promoPrice" },
          lesson: {
            $push: {
              title: "$_id.lessonTitle",
              permission: "$_id.lessonPermission",
              totalTime: "$_id.lessonTotalTime",
              isView: "$_id.lessonIsView",
              price: "$_id.lessonPrice",
              videoList: "$videoList",
            },
          },
        },
      },
    
    ];

    const detailCourseOnline = await CourseOnline.aggregate(query);
    console.log("detailCourseOnline", detailCourseOnline);

    return res.json({
      data: detailCourseOnline,
    });
  } catch (error) {
    console.error("Error in getDetailCourseOnline:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
const getListCourseOnline = async (req, res) => {
  console.log("getListCourseOnline", req.query);
  const query = {};

  if (req.query.query) {
    query.$or = [
      { course_code: { $regex: req.query.query || "", $options: "i" } },
    ];
  }

  try {
    const courseOnlineList = await CourseOnline.find(query)
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .exec();

    const count = await CourseOnline.countDocuments(query);

    return res.json({
      data: courseOnlineList,
      total: count,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const getListVideoCourseOnline = async (req, res) => {
  const listVideo = [];
};

const createArrayCourseOnline = async (req, res) => {
  const arrayCourse = [...req.body];
  console.log("createArrayCourse", arrayCourse);
  arrayCourse.map(async (item) => {
    const course = new CourseOnline(item);
    await course.save();
  });
  return res.status(201).send(arrayCourse);
};

const createCourseOnline = async (req, res) => {
  const courseOnline = req.body;
  courseOnline._id = new ObjectID();
  // const findItem = await Course.find({ course_code: course_code });
  // console.log("findItem:", findItem);
  // if (findItem.length > 0) {
  //   return res.status(409).send({
  //     status: "Conflict",
  //     data: "Mã khóa học đã tồn tại!!!",
  //   });
  // }
  console.log("courseOnline", courseOnline);
  const newCourseOnline = new CourseOnline({
    ...courseOnline,
  });
  console.log("newCourseOnline", newCourseOnline);
  await newCourseOnline.save();
  return res.json({
    data: newCourseOnline,
  });
};

const deleteCourseOnline = async (req, res) => {
  try {
    const { _id } = req.params;

    const status = await CourseOnline.deleteOne({
      _id: ObjectID(_id),
    });

    if (status) {
      return res.status(200).send({ _id: _id });
    } else {
      return res
        .status(400)
        .send({ status: "failed", message: "Xóa thất bại" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCourseOnline = async (req, res) => {
  try {
    const { _id } = req.params;
    const courseOnline = req.body;
    const result = await CourseOnline.findByIdAndUpdate(
      { _id: ObjectID(_id) },
      courseOnline,
      { new: true }
    ).exec();
    res.status(200).send(courseOnline);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getDetailCourseOnline,
  getListCourseOnline,
  createCourseOnline,
  createArrayCourseOnline,
  updateCourseOnline,
  deleteCourseOnline,
};
