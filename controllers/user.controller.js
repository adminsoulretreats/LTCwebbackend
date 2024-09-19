const { User } = require("../models/users.model");
const bcrypt = require("bcryptjs");
const { mailer } = require("../helpers/mailer.helper");

const getList = async (req, res) => {
  const query = {};
  let total;

  if (req.query.keyword) {
    query.$or = [
      { email: { $regex: req.query.keyword || "", $options: "i" } },
      { name: { $regex: req.query.keyword || "", $options: "i" } },
      { phone: { $regex: req.query.keyword || "", $options: "i" } },
    ];
  }

  if (req.query.role) {
    query.role = req.query.role;
  }

  if (req.query.gender) {
    query.gender = req.query.gender;
  }

  try {
    const userList = await User.find(query)
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .exec();

    const count = await User.countDocuments(query);

    return res.json({
      data: userList,
      total: count,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userDetail = await User.findById(id).exec();
    if (userDetail) {
      res.status(200).send(userDetail);
    } else {
      res.status(400).send({
        message: `Not found detail user have id ${id}`,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const create = async (req, res) => {
  const { file } = req;
  const { password, email } = req.body;
  const findItem = await User.findByEmail(email);
  if (findItem) {
    return res.status(401).send({
      status: "failed",
      data: "Email Existed!!!",
    });
  }

  let urlImage = "";
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  if (file) {
    urlImage = `${process.env.SERVER_HOSTNAME}/${file.path}`;
  }

  const newUser = new User({
    ...req.body,
    password: hashPassword,
    avatar: urlImage.length ? urlImage : "",
  });

  await newUser.save();

  return res.status(201).send(newUser);
};

const remove = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    if (user._id === id) {
      return res.status(400).send({
        error: "Can't not delete user",
      });
    } else {
      const userDelete = await User.deleteOne({
        _id: id,
      });

      return res.status(200).send(userDelete);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateWithRoleClient = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (password)
    return res.status(400).send({
      status: "failed",
      data: "Client can't not update with password",
    });

  try {
    const result = await User.findByIdAndUpdate(id, { ...req.body }).exec();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateWithRoleAdmin = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const result = await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
        password: hashPassword,
      },
      { new: true }
    ).exec();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const uploadAvatar = async (req, res) => {
  const { file, user } = req;

  const urlImage = `${process.env.SERVER_HOSTNAME}/${file.path}`;

  try {
    await User.findByIdAndUpdate(user._id, {
      avatar: urlImage,
    }).exec();

    res.status(200).send({
      status: "success",
      data: urlImage,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Can't find user",
    });
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const { user } = req;

    const deleteUserAvatar = await User.findById(user._id).exec();

    // const getFileAvatarname = deleteUserAvatar.avatar
    //   .split("/")
    //   .slice(-1)
    //   .pop();

    try {
      // fs.unlinkSync(`${getFileAvatarname}`);

      if (deleteUserAvatar) {
        await User.findByIdAndUpdate(user._id, {
          avatar: "",
        }).exec();

        res.status(200).send({
          status: "success",
          message: "Xóa thành công",
        });
      } else {
        res.status(400).send({
          status: "failed",
          message: "Can't find user",
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const hello = async (req, res) => {
  const query = {};
  let total;

  if (req.query.keyword) {
    query.$or = [
      { email: { $regex: req.query.keyword || "", $options: "i" } },
      { name: { $regex: req.query.keyword || "", $options: "i" } },
      { phone: { $regex: req.query.keyword || "", $options: "i" } },
    ];
  }

  if (req.query.role) {
    query.role = req.query.role;
  }

  if (req.query.gender) {
    query.gender = req.query.gender;
  }

  try {
    const userList = await User.find(query)
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .exec();

    const count = await User.countDocuments(query);

    return res.json({
      data: userList,
      total: count,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const sendFormContact = (req, res) => {
  // const { file } = req;
  const { name, email } = req.body;
  const htmlTemplate = `<div>
  <h1>
    Xin chào, bạn vừa gửi thông tin liên hệ tại LIFE UNI.
  </h1>

  <p>Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
  </div>
  `;

  try {
    mailer(email, "Thông Tin Liên Hệ Life Uni", htmlTemplate);

    res.status(200).send({
      status: "success",
      token: token,
      message: htmlTemplate,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "failed",
    });
  }
};

module.exports = {
  getList,
  getDetail,
  create,
  remove,
  uploadAvatar,
  deleteAvatar,
  updateWithRoleClient,
  updateWithRoleAdmin,
  hello,
  sendFormContact,
};
