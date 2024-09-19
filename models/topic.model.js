const { Schema, model } = require("mongoose");

const TopicSchema = new Schema(
  {
    name: String,
    topicStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: Date,
  }
);

const Topic = model("Topic", TopicSchema);

module.exports = {
  Topic,
  TopicSchema,
};
