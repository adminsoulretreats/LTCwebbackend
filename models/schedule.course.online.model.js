const { Schema, model } = require("mongoose");

const ScheduleCourseOnlineSchema = new Schema({
  startTime: {
    type: Number,
  },
  endTime: {
    type: Number,
  },
  course_id: Schema.Types.ObjectId,
  note: { type: String },
  timestamps: { type: Date },
  courseOnline: { type: Array, default: [] },
  studentList: { type: Array, default: [] },
  listUser: { type: Array, default: [] },
  ranking: { type: Array, default: [] },
});

const ScheduleCourseOnline = model(
  "schedule_course_online",
  ScheduleCourseOnlineSchema
);

module.exports = {
  ScheduleCourseOnline,
  ScheduleCourseOnlineSchema,
};
