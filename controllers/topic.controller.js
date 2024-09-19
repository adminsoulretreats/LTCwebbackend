const { Topic } = require("../models/topic.model");

const getAll = async (req, res) => {
  const getList = await Topic.find({});

  if (!getList) {
    res.status(400).send({
      status: "success",
      message: "Empty List",
    });
  } else {
    res.status(200).send({
      status: "success",
      data: getList,
    });
  }
};

const create = async (req, res) => {
  try {
    const newTopic = new Topic({ ...req.body });

    await newTopic.save();
    res.status(200).send(newTopic);
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Can't created topic",
    });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await Topic.findByIdAndDelete(id);

    if (status) {
      res.status(200).send({ status: "success", message: "Xóa thành công" });
    } else {
      res.status(400).send({ status: "failed", message: "Xóa thất bại" });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Can't deleted topic",
    });
  }
};

module.exports = {
  getAll,
  create,
  remove,
};
