const { Student } = require("../models/student.model");
const bcrypt = require("bcryptjs");
var ObjectID = require("mongodb").ObjectID;
const getListStudent = async (req, res) => {
  console.log("getListStudent", req.query);
  const query = {};
  let total;

  if (req.query.query) {
    query.$or = [
      { cccd: { $regex: req.query.query || "", $options: "i" } },
      { email: { $regex: req.query.query || "", $options: "i" } },
      { name: { $regex: req.query.query || "", $options: "i" } },
      { phone: { $regex: req.query.query || "", $options: "i" } },
    ];
  }

  //   if (req.query.role) {
  //     query.role = req.query.role;
  //   }

  if (req.query.query?.gender) {
    query.gender = req.query.gender;
  }
  try {
    const studentList = await Student.find(query)
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .exec();

    const count = await Student.countDocuments(query);

    return res.json({
      data: studentList,
      total: count,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const createArrayStudent = async (req, res) => {
  const arrayStudent = [...req.body];
  console.log("createArrayStudent", arrayStudent);
  arrayStudent.map(async (item) => {
    const student = new Student(item);
    await student.save();
  });
  return res.status(201).send(arrayStudent);
};

const createStudent = async (req, res) => {
  console.log("createStudent");
  const { file } = req;
  const { cccd } = req.body;

  const findItem = await Student.find({ cccd: cccd });
  console.log("findItem:", findItem);
  if (findItem.length > 0) {
    return res.status(409).send({
      status: "Conflict",
      data: "Cccd đã tồn tại!!!",
    });
  }
  let urlImage = "";
  //   const salt = bcrypt.genSaltSync(10);
  //   const hashPassword = bcrypt.hashSync(password, salt);
  if (file) {
    urlImage = `${process.env.SERVER_HOSTNAME}/${file.path}`;
  }
  const newStudent = new Student({
    ...req.body,
    avatar: urlImage.length ? urlImage : "",
  });
  await newStudent.save();
  return res.status(201).send(newStudent);
};

const updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Student.findByIdAndUpdate(
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

const deleteStudent = async (req, res) => {
  try {
    const student = req.body;
    const { id } = req.params;

    console.log("deleteStudent", student);
    const status = await Student.deleteOne({
      _id: id,
    });

    if (status) {
      return res.status(200).send(student);
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
  getListStudent,
  createStudent,
  createArrayStudent,
  updateStudent,
  deleteStudent,
};
