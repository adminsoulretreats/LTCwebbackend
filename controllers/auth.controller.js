const { User } = require("../models/users.model");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { config } = require("../config");
const jwt = require("jsonwebtoken");
const { mailer } = require("../helpers/mailer.helper");
const { verifyToken } = require("../helpers/jwt.helper");
// const { google } = require("googleapis");

// const oAuth2Client = new google.auth.OAuth2(
//   client_id,
//   client_secret,
//   redirect_uris[0]
// );

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const userLogin = await User.findByEmail(email.toLowerCase());

  if (!userLogin) {
    res.status(500).send({
      status: "failed",
      message: "Email or Password incorrect!!!",
    });
  } else {
    const secretKey = config.credential.secretKey;
    const isAuth = bcrypt.compareSync(password, userLogin.password);
    if (isAuth) {
      const token = jwt.sign(
        {
          _id: userLogin._id,
          email: userLogin.email,
          role: userLogin.role,
        },
        secretKey
      );

      res.status(200).send({ status: "success", token, userLogin });
    } else {
      res.status(500).send({
        status: "failed",
        message: "Email or Password incorrect!!!",
      });
    }
  }
};

const signUp = async (req, res) => {
  const userData = req.body;
  const correctEmail = userData.email.toLowerCase();
  const userRegiser = await User.findByEmail(correctEmail);
  if (userRegiser) {
    res.status(202).send({
      status: "failed",
      message: "Email này đã được đăng ký",
    });
  } else {
    if (userData.password === userData.rePassword) {
      delete userData.rePassword;
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(userData.password, salt);
      userData.password = hashPassword;
      console.log("userData", userData);
      console.log("hashPassword", hashPassword);
      const newUser = new User(userData);
      await newUser.save();
      res.status(200).send({
        status: "success",
        message: "Tạo tài khoản thành công",
        user: newUser,
      });
    }

    // const secretKey = config.credential.secretKey;
    // const hostName =
    //   process.env.NODE_ENV === "production"
    //     ? process.env.CLIENT_HOSTNAME
    //     : process.env.DEV_HOSTNAME;
    // Create Token
    // console.log("hostName:", hostName, userData);
    // const token = jwt.sign(
    //   {
    //     ...userData,
    //     email: correctEmail,
    //     password: hashPassword,
    //   },
    //   secretKey,
    //   { expiresIn: 60 * 5 } // (60 giây x 5) => 5 phút
    // );

    // const htmlTemplate = `<div>
    //   <h1>
    //     Xin chào, nếu bạn đang đăng ký tài khoản tại THE ORIGINS thì bạn hãy click vào link bên dưới
    //   </h1>

    //   <a href="${hostName}/xac-nhan-dang-ky/${token}">
    //     Click Vào Đây
    //   </a>

    //   <p>Nếu đây là sự nhầm lẫn, bạn có thể bỏ qua. Đây là Email tự động bạn không cần phải phản hồi. Cảm ơn bạn</p>
    //   </div>
    //   `;
    // try {
    //   // mailer(
    //   //   userData.email,
    //   //   "BƯỚC CUỐI HOÀN THÀNH VIỆC ĐĂNG KÝ TÀI KHOẢN",
    //   //   "Xác thực tài khoản",
    //   //   htmlTemplate
    //   // );

    // } catch (error) {
    //   res.status(500).send({
    //     status: "failed",
    //     message: "Register not success!!!, maybe your email already registered",
    //   });
    // }
  }
};

const verifySignUp = async (req, res) => {
  const token = req.body.token || req.query.token || req.header("token");
  try {
    const decode = await verifyToken(token, config.credential.secretKey);
    const { first_name, email, gender, phone, dob, password } = decode;
    const newUser = new User({
      first_name,
      email,
      gender,
      phone,
      dob,
      password,
    });
    await newUser.save();

    res.status(200).send({
      status: "success",
      user: newUser,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token has expired
      res.status(401).send({ message: "Token expired" });
    } else {
      // Some other error occurred during token verification
      res.status(403).send({ message: "Invalid token" });
    }
  }
};

const changePassword = async (req, res) => {
  const { id, newPassword, oldPassword } = req.body;

  let userInfo = await User.findById(id);

  if (!userInfo) {
    res.status(404).send({
      status: "failed",
      message: "Can't find user to change password!!!",
    });
  } else {
    const isAuth = bcrypt.compareSync(oldPassword, userInfo.password);

    if (isAuth) {
      const salt = bcrypt.genSaltSync(10);
      const hashNewPassword = bcrypt.hashSync(newPassword, salt);

      await User.findByIdAndUpdate(id, {
        password: hashNewPassword,
      }).exec();

      res.status(200).send({
        status: "success",
        message: "Changed Password Successfully!!!",
      });
    } else {
      res.status(404).send({
        status: "failed",
        message: "Can't change password, Wrong old password!!!",
      });
    }
  }
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;

  const userForgot = await User.findByEmail(email);

  if (!userForgot) {
    res.status(404).send({
      status: "failed",
      message: "Email is not exist!!!",
    });
  } else {
    const secretKey = config.credential.secretKey;

    const token = jwt.sign(
      {
        email,
      },
      secretKey,
      { expiresIn: 60 * 5 } // (60 x 5) => 5 minutes
    );

    const htmlTemplate = `
    <p>
      Để lấy lại mật khẩu bạn truy cập đường link bên dưới.
    </p>
    <br />
    <a href="${process.env.CLIENT_HOSTNAME}/xac-nhan-quen-mat-khau/${token}">Click vào đây</a>
    `;

    // Create a link contains token email
    // /api/auth/veirfy-forgot-password/${token}
    try {
      mailer(email, "Xác nhận quên mật khẩu", "Lấy lại mật khẩu", htmlTemplate);

      res.status(200).send({
        status: "success",
        message: "Forgot password email has been sent!!!",
      });
    } catch (error) {
      res.status(404).send({
        status: "failed",
        message: "Can't send email. Maybe Error mailer module!!!",
      });
    }
  }
};

const verifyForgotPassword = async (req, res) => {
  const token = req.body.token || req.query.token || req.header("token");
  const { password } = req.body;

  try {
    const decode = await verifyToken(token, config.credential.secretKey);
    const { email } = decode;

    const salt = bcrypt.genSaltSync(10);
    const hashNewPassword = bcrypt.hashSync(password, salt);

    await User.findOneAndUpdate(
      { email },
      {
        password: hashNewPassword,
      }
    );

    res.status(200).send({
      status: "success",
      message: "Changed Password Successfully!!!",
    });
  } catch (error) {
    res.status(404).send({
      status: "failed",
      message: "Change password error!!!",
    });
  }
};

const fetchWithToken = async (req, res) => {
  const token = req.body.token || req.query.token || req.header("token");

  try {
    const decode = await verifyToken(token, config.credential.secretKey);

    const userLogin = await User.findByEmail(decode.email);

    res.status(200).send({
      status: "success",
      data: userLogin,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error,
    });
  }
};

const addToSheet = async (req, res) => {
  const { data } = req.body;
  const spreadsheetId = "1uHjY9XL3OsS0mZ54CdyYRXI6rDSHSUpn5ltw9iTgngY";
  const range = "duphong"; // Specify the sheet name

  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

  try {
    // Append data to the end of the sheet
    // const response = await sheets.spreadsheets.values.append({
    //   spreadsheetId,
    //   range,
    //   valueInputOption: "RAW",
    //   resource: {
    //     values: [data],
    //   },
    //   insertDataOption: "INSERT_ROWS",
    // });
    // res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding data to sheet");
  }
};
module.exports = {
  signIn,
  signUp,
  changePassword,
  forgotPassword,
  verifyForgotPassword,
  verifySignUp,
  fetchWithToken,
  addToSheet,
};
