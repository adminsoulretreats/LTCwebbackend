const multer = require("multer");

const uploadImageSingle = (type) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/${type}`); // setup chổ cần lưu file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname); // đặt lại tên cho file
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      // const extensionImageList = [".png", ".jpg", ".jpeg"];
      // const extension = file.originalname.slice(-4 | -5);
      // const check = extensionImageList.includes(extension);
      // if (check) {
      //   cb(null, true);
      // } else {
      //   cb(new Error("extension không hợp lệ"));
      // }

      let extensionImageList = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ]; // Array của mimetype hình ảnh
      const check = extensionImageList.indexOf(file.mimetype) === -1; // Tìm index của file nếu có sẽ trả về !== -1, không tồn tại trả về === -1

      if (check) {
        cb(new Error("extension không hợp lệ"));
      }

      cb(null, true);
    },
  });

  return upload.single(type);
};

const uploadImageMultiple = (type, amount) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/${type}`); // setup chổ cần lưu file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname); // đặt lại tên cho file
    },
  });
  const upload = multer({
    storage: storage,
    // fileFilter: function (req, file, cb) {
    //   const extensionImageList = [".png", ".jpg"];
    //   const extension = file.originalname.slice(-4);
    //   const check = extensionImageList.includes(extension);
    //   if (check) {
    //     cb(null, true);
    //   } else {
    //     cb(new Error("extension không hợp lệ"));
    //   }
    // },
  });

  return upload.array(type, amount);
};

module.exports = {
  uploadImageSingle,
  uploadImageMultiple,
};
