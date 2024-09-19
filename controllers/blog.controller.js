const { Blog } = require("../models/blog.model");
const { Topic } = require("../models/topic.model");

const getAll = async (req, res) => {
  try {
    const list = await Blog.find({
      blogStatus: true,
    })
      .select({ content: 0 })
      .populate({
        path: "author",
        select: { name: 1, _id: 1, avatar: 1, email: 1 },
      })
      .populate({
        path: "topicId",
        select: { name: 1, _id: 1 },
      })
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).send({
      status: "Success",
      data: list,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      error,
    });
  }
};

const uploadImage = (req, res) => {
  const { file } = req;

  if (!file) {
    res.status(400).send({
      status: "failed",
      message: "Can't find user",
    });
  } else {
    res.status(200).send({
      status: "success",
      url: file.path,
    });
  }
};

const create = async (req, res) => {
  const { file, user, body } = req;
  const { topicId, title, content, url } = body;

  try {
    const topic = await Topic.findById(topicId).exec();

    // Check topic by topicId
    if (!topic) {
      return res.status(400).send({
        status: "failed",
        message: "Error can't find topic",
      });
    }

    const urlImage = `${process.env.SERVER_HOSTNAME}/${file.path}`;

    const newBlog = new Blog({
      topicId,
      title,
      content,
      url,
      cover: urlImage,
      author: user._id,
    });

    await newBlog.save();

    return res.status(200).send({
      status: "Success",
      message: "Create Blog successfully!",
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: error,
    });
  }
};

const getDetail = async (req, res) => {
  const { url } = req.params;

  try {
    const detail = await Blog.findOne({
      url: url,
    })
      .populate({
        path: "author",
        select: { name: 1, _id: 1, avatar: 1, email: 1 },
      })
      .populate({
        path: "topicId",
        select: { name: 1, _id: 1 },
      })
      .exec();

    return res.status(200).send({
      status: "Success",
      data: detail,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      error,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.body;

    const blogDelete = await Blog.deleteOne({
      _id: id,
    });

    res.status(200).send(blogDelete);
  } catch (error) {
    res.status(500).send(error);
  }
};

const edit = (req, res) => {};

module.exports = {
  uploadImage,
  create,
  edit,
  getAll,
  getDetail,
  remove,
};
