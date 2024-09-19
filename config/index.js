"use strict";
require("dotenv").config();

const MONGO_ATLAS =
  "mongodb+srv://creatorteam:qxzIDL9SybgrsQhz@soulretreats.pfjts4c.mongodb.net/soulretreats?retryWrites=true&w=majority";

const MONGO_USER = process.env.MONGO_USER || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_IP = process.env.IP || "";
const MONGO_MONGO_PORT = process.env.MONGO_PORT || "";
const MONGO_FULL_PATH =
  !!MONGO_IP && !!MONGO_PORT
    ? `mongodb://${MONGO_IP}:${MONGO_IP}`
    : MONGO_ATLAS;

const MONGO = {
  user: MONGO_USER,
  pass: MONGO_PASSWORD,
  ip: MONGO_IP,
  port: MONGO_MONGO_PORT,
  uris: MONGO_FULL_PATH,
  atlas: MONGO_ATLAS,
};

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_HOSTNAME =
  process.env.SERVER_HOSTNAME || `localhost:${SERVER_PORT}`;

const SERVER = {
  hostName: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const CREDENTIAL = {
  secretKey: SECRET_KEY,
  email: EMAIL,
  password: PASSWORD,
};

const config = {
  mongo: MONGO,
  server: SERVER,
  credential: CREDENTIAL,
  isProduction: process.env.NODE_ENV === "production",
};

module.exports = {
  config,
};
