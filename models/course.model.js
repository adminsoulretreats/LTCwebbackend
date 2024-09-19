const { Schema, model } = require("mongoose");

const CourseSchema = new Schema(
  {
    course_code: {
      type: String,
      unique: true,
    },
    course_start_time: {
      type: Date,
    },
    course_end_time: {
      type: Date,
    },
    course_location: {
      type: String,
    },
    total_register: {
      type: Number,
    },
    total_checkin: {
      type: Number,
    },
    note: { type: String },
  },
  {
    timestamps: Date,
  },
  // { 
  //   town_course :{
  //     name:String,
  //     prince:Number,
  //     time_to_reset:Date,
  //     detail:String,
  //     src:String,
  //     complete:Number,
  //     question:[],

  //   }
  // }
);

CourseSchema.statics = {
  findByCourseCode(courseCode) {
    return this.findOne({ course_code: courseCode }).exec();
  },

  createNew(course) {
    return this.create(course);
  },
};

const Course = model("Course", CourseSchema);

module.exports = {
  Course,
  CourseSchema,
};
