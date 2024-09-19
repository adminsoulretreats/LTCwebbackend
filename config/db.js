const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      retryWrites: true,
    });

    console.log("Kết nối thành công đến database");
  } catch (error) {
    console.log("Kết nối thất bại đến database");
  }
}

module.exports = { connect };
