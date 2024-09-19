require("dotenv").config();
// Import library
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { rootRouter } = require("./routers/rootRouter");
const app = express();
const db = require("./config/db");
const path = require("path");

const publicPathDirectory = path.join(__dirname, "./public");

app.use(bodyParser.json());
const corsOptions = {
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use("/", rootRouter);
app.use("/public", express.static(publicPathDirectory));

db.connect();

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Backend đang chạy trên PORT: ${port}`);
});
