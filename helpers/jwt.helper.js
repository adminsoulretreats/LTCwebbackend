/*
 *   Created By: Mạnh Đạt
 *   On 2/7/2021
 */
const jwt = require("jsonwebtoken");

/**
 * private function generateToken
 * Hàm tạo mã token
 * @param user
 * @param secretSignature
 * @param tokenLife
 */
let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user lấy (_id, name, email, role_id)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Thực hiện ký và tạo token
    jwt.sign(
      { data: userData },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

/**
 * This module used for verify jwt token
 * Hàm giải mã token
 * @param {*} token
 * @param {*} secretKey
 */
// let verifyToken = (token, secretKey) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, secretKey, (error, decoded) => {
//       if (error) {
//         console.log("error", error);
//         return reject(error);
//       }
//       console.log("decoded", decoded);
//       resolve(decoded);
//     });
//   });
// };
const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      resolve(decoded);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  generateToken,
  verifyToken,
};
