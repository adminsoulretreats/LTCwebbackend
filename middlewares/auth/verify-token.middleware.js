/**
 * Author: Mạnh Đạt
 * On 7/7/2021
 */

const { verifyToken } = require("../../helpers/jwt.helper");
const { config } = require("../../config");
const jwt = require("jsonwebtoken");
/**
 * Kiểm tra người dùng đã đăng nhập
 */
const authenticate = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.header("token") ||
    req.header.authorization;
  const secretKey = config.credential.secretKey;
  try {
    if (!token) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden: Token not provided",
      });
    }

    const decoded = await verifyToken(token, secretKey);

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized: Token expired",
      });
    } else {
      console.error("Token verification error:", error.message);
      return res.status(400).json({
        status: "fail",
        message: "Bad Request: Unable to verify token",
      });
    }
  }
};

// Middleware to check if the request's IP is in the whitelist
const ipWhitelistMiddleware = (req, res, next) => {
  // Get the client's IP address
  var whitelistSandbox = ["113.160.92.202", "::1"];
  var whitelistProduction = [
    "13.52.45.78",
    "116.97.245.130",
    "42.118.107.252",
    "113.20.97.250",
    "203.171.19.146",
    "103.220.87.4",
    "103.220.86.4",
    "::1",
  ];
  var whitelist =
    process.env.VNPAY === "production" ? whitelistProduction : whitelistSandbox;

  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // If behind a proxy, 'x-forwarded-for' might contain multiple IPs; take the first one
  const ip = clientIp.split(",")[0].trim();

  // Check if the IP is in the whitelist
  if (whitelist.includes(ip)) {
    next(); // IP is allowed, proceed to the next middleware or route handler
  } else {
    res.status(403).send("Access Denied: Your IP is not whitelisted.");
  }
};

/**
 * Kiểm tra phân quyền người dùng
 * array permission = ["admin", "client"]
 * 1. "admin" => admin = user.role => next()
 * 2. "client" => client = user.role => next()
 */

const authorize = (userTypeArray) => {
  return (req, res, next) => {
    const { user } = req;

    // xem user có quyền thực hiện action đó không
    if (userTypeArray.findIndex((role) => role === user.role) > -1) {
      // user có đủ quyền

      return next();
    } else {
      // Nếu user không có quyền
      return res.status(403).json({
        status: "fail",
        message: "You don't have permission!!!",
      });
    }
  };
};

module.exports = { authenticate, authorize, ipWhitelistMiddleware };
