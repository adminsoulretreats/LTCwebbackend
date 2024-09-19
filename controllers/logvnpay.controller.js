const { LogVnpay } = require("../models/logvnpay.model");
const moment = require("moment");

const createLogvnpay = async (queryString, ipAddr, message, type) => {
  let dateFormat = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log("dateFormat", dateFormat, typeof dateFormat);
  let ip = ipAddr.split(",")[0];
  const log = new LogVnpay({
    queryString: queryString,
    ipAddr: ip,
    createDate: dateFormat,
    message: message,
    type: type,
  });
  await log.save();
};

const getLogvnpay = async (req, res) => {
  console.log("getLogvnpay");
  // let query = { queryString: { $regex: "24164553::1" } };
  // const result = LogVnpay.find({ queryString: { $regex: "24164553::1" } });
  // return res.json({
  //   result,
  // });
  const result = await LogVnpay.find({
    queryString: {
      $regex: "251027131",
    },
  });

  // { queryString: { $regex: "24164553.*vnp_ResponseCode=99"}

  return res.json(result);
};
module.exports = {
  createLogvnpay,
  getLogvnpay,
};
