const { Schema, model } = require("mongoose");

const QuestionSchema = new Schema({
  question: {
    type: String,
  },
  options: {
    type: Array,
  },
  answer: { type: String },
  listVideo: { type: Array },
});

const Question = model("question", QuestionSchema);

module.exports = {
  Question,
  QuestionSchema,
};
