const { Schema, model } = require("mongoose");

const CourseOnlineSchema = new Schema({
  name: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
  },
  lesson: {
    type: Array,
    default: [],
  },
  pharse: {
    type: String,
  },
  rank_month: {},
  rank_year: {},
  totalStudent: {
    type: Number,
  },
});

const CourseOnline = model("course_online", CourseOnlineSchema);

module.exports = {
  CourseOnline,
  CourseOnlineSchema,
};
