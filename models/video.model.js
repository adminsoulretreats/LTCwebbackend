const { Schema, model } = require("mongoose");

const VideoSchema = new Schema({
  name: {
    type: String,
  },
  url: {
    type: String,
  },
  duration: {
    type: Number,
  },
  questionList: {
    type: Array,
    default: [],
  },
});

VideoSchema.statics = {};

const Video = model("video", VideoSchema);

module.exports = {
  Video,
  VideoSchema,
};
