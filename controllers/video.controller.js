const { Video } = require("../models/video.model");
var ObjectID = require("mongodb").ObjectID;
const getListVideo = async (req, res) => {
  console.log("getListVideo", req.query);
  const query = {};

  if (req.query.query) {
    query.$or = [{ name: { $regex: req.query.query || "", $options: "i" } }];
  }

  try {
    const videoList = await Video.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "questionList._id",
          foreignField: "_id",
          as: "questionList",
        },
      },
    ]).exec();
    console.log("videoList:", videoList);
    const count = await Video.countDocuments(query);
    console.log("count:", count);
    return res.json({
      data: videoList,
      total: count,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const getVideoDetail = async (req, res) => {
  console.log("getVideoDetail", req.query);
};

const createVideo = async (req, res) => {
  const newVideo = new Video({
    ...req.body,
  });
  console.log("newVideo", newVideo);

  // change string question is to objectId

  newVideo.questionList.map((question, idx) => {
    question._id = ObjectID(question._id);
  });
  console.log("newVideo 2123", newVideo);
  await newVideo.save();
  return res.json({
    data: newVideo,
  });
};

const deleteVideo = async (req, res) => {
  try {
    // const { _id } = req.params;
    const { _id } = req.params;
    const deleteVideo = await Video.deleteOne({
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

const editVideo = async (req, res) => {
  try {
    const { _id } = req.params;
    const video = req.body;
    console.log("_id", _id);
    console.log("video", video);
    video.questionList.map((question, idx) => {
      question._id = ObjectID(question._id);
    });

    const result = await Video.findByIdAndUpdate(ObjectID(_id), video).exec();
    console.log("result", result);
    res.status(200).send(video);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  getListVideo,
  getVideoDetail,
  createVideo,
  deleteVideo,
  editVideo,
};
