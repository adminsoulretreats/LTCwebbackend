const { Product } = require("../models/product.model");

const getAll = async (req, res) => {
  // const allProductList = await Product.getAll();
  const allProductList = await Product.find().populate("categoryId", {
    name: 1,
  });

  if (allProductList.length < 0) {
    res.status(200).send({
      message: "Danh sách sản phẩm trống",
    });
  } else {
    res.status(200).send(allProductList);
  }
};

const getDetail = async (req, res) => {
  const { id } = req.params;

  const ProdDetail = await Product.findById(id);

  if (ProdDetail) {
    res.status(200).send({
      data: ProdDetail,
    });
  } else {
    res.status(400).send({
      message: "Không tim thấy sản phẩm!!!",
    });
  }
};

const create = async (req, res) => {
  const { name, categoryId, rating, amount, price, imgSrc, description } =
    req.body;

  try {
    let pictureFiles = req.files;
  } catch (error) {}

  // try {
  //   const newProduct = new Product({
  //     name,
  //     categoryId,
  //     rating,
  //     amount,
  //     price,
  //     imgSrc,
  //     description,
  //   });

  //   await newProduct.save();

  //   res.status(200).send({
  //     message: "Tạo sản phẩm thành công!!!",
  //   });
  // } catch (error) {
  //   res.status(500).send(error);
  // }
};

const edit = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.findByIdAndUpdate(id, { ...req.body }).exec();

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const productDelete = await Product.deleteOne({
      _id: id,
    });

    res.status(200).send(productDelete);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAll,
  getDetail,
  create,
  edit,
  remove,
};
