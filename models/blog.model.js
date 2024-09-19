const { Schema, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    content: {
      type: [],
      required: true,
    },
    blogStatus: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: Date,
  }
);

const Blog = model("Blog", BlogSchema);

module.exports = {
  Blog,
  BlogSchema,
};
