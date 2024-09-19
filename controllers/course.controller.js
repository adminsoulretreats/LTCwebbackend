const { Course } = require("../models/course.model");
const bcrypt = require("bcryptjs");
var ObjectID = require("mongodb").ObjectID;
const getListCourse = async (req, res) => {
  console.log("getListCourse", req.query);
  const query = {};
  let total;

  if (req.query.query) {
    query.$or = [
      { course_code: { $regex: req.query.query || "", $options: "i" } },
    ];
  }

  try {
    const courseList = await Course.find(query)
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .exec();

    const count = await Course.countDocuments(query);

    return res.json({
      data: courseList,
      total: count,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const createArrayCourse = async (req, res) => {
  const arrayCourse = [...req.body];
  console.log("createArrayCourse", arrayCourse);
  arrayCourse.map(async (item) => {
    const course = new Course(item);
    await course.save();
  });
  return res.status(201).send(arrayCourse);
};

const createCourse = async (req, res) => {
  console.log("createCourse");
  const { course_code } = req.body;

  const findItem = await Course.find({ course_code: course_code });
  console.log("findItem:", findItem);
  if (findItem.length > 0) {
    return res.status(409).send({
      status: "Conflict",
      data: "Mã khóa học đã tồn tại!!!",
    });
  }

  const newCourse = new Course({
    ...req.body,
  });
  await newCourse.save();
  return res.status(201).send(newCourse);
};

const updateCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Course.findByIdAndUpdate(
      { _id: ObjectID(id) },
      {
        ...req.body,
      },
      { new: true }
    ).exec();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = req.body;
    const { id } = req.params;

    console.log("deleteCourse", course);
    const status = await Course.deleteOne({
      _id: id,
    });

    if (status) {
      return res.status(200).send(course);
    } else {
      return res
        .status(400)
        .send({ status: "failed", message: "Xóa thất bại" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getListCourse,
  createCourse,
  createArrayCourse,
  updateCourse,
  deleteCourse,
};
