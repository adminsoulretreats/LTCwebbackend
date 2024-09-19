const { Question } = require("../models/question.model");
var ObjectID = require("mongodb").ObjectID;
const getListQuestion = async (req, res) => {
  console.log("getListQuestion", req.query);
  const query = {};

  if (req.query.query) {
    query.$or = [
      { question: { $regex: req.query.query || "", $options: "i" } },
    ];
  }

  try {
    const questionList = await Question.aggregate([
      {
        $lookup: {
          from: "videos",
          localField: "inforVideo",
          foreignField: "_id",
          as: "inforVideo",
        },
      },
    ]).exec();

    const count = await Question.countDocuments(query);
    return res.json({
      data: questionList,
      total: count,
    });
  } catch (error) {
    console.log("failed");
    return res.json({
      status: "failed",
      message: error,
    });
  }
};
const createQuestion = async (req, res) => {
  const newQuestion = new Question({
    ...req.body,
  });
  console.log("newQuestion", newQuestion);

  await newQuestion.save();
  return res.json({
    data: newQuestion,
  });
};

const deleteQuestion = async (req, res) => {
  try {
    // const { _id } = req.params;
    const { _id } = req.params;
    const questionDelete = await Question.deleteOne({
      _id: ObjectID(_id),
    });
    console.log(" _id", _id);

    return res.json({
      _id: _id,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const editQuestion = async (req, res) => {
  try {
    const { _id } = req.params;
    const question = req.body;
    console.log("_id", _id);
    console.log("question", question);
    const result = await Question.findByIdAndUpdate(
      ObjectID(_id),
      question
    ).exec();
    console.log("result", result);
    res.status(200).send(question);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  getListQuestion,
  createQuestion,
  deleteQuestion,
  editQuestion,
};
