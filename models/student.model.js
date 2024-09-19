const { Schema, model } = require("mongoose");

const StudentSchema = new Schema(
  {
    cccd: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    from: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    birthday: {
      type: Number,
    },
    job: {
      type: String,
    },
    course: {
      type: String,
    },
    fee_payable: {
      type: Number,
    },
    fee_have_been_paid: {
      type: Number,
    },
    fee_unpaid: {
      type: Number,
    },
    fee_done: {
      type: Boolean,
    },
    old_student: { type: String },
    note: { type: String },
  },
  {
    timestamps: Date,
  }
);

StudentSchema.statics = {
  findByCccd(cccd) {
    return this.findOne({ cccd: cccd }).exec();
  },

  createNew(student) {
    return this.create(student);
  },
};

const Student = model("Student", StudentSchema);

module.exports = {
  Student,
  StudentSchema,
};
