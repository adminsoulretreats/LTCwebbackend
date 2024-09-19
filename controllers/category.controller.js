const { Category } = require("../models/category.model");

const create = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = new Category({
      name,
    });

    await newCategory.save();

    res.status(200).send({
      message: "Tạo danh mục thành công",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAll = async (req, res) => {
  try {
    const categoryList = await Category.find({});

    res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).send(error);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await Category.findByIdAndDelete(id);

    if (status) {
      res.status(200).send({ message: "Xóa thành công" });
    } else {
      res.status(500).send({ message: "Xóa thất bại, có thể truyền sai id" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const edit = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const status = await Category.findOneAndUpdate(
      { _id: id },
      {
        name,
      }
    );

    if (status) {
      res.status(200).send({ message: "Sửa thành công" });
    } else {
      res.status(500).send({ message: "Sửa thất bại, có thể truyền sai id" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  create,
  getAll,
  remove,
  edit,
};
