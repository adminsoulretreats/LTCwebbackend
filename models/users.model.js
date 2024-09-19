const { Schema, model } = require("mongoose");

/**
 *  NOTE:
 *  email is unique
 *  birthDay is timestamp in miliseconds. Ex: 895004164000
 *  ICN: Identify card (Chứng minh nhân dân)
 *  role: have 2 role ["admin"] and ["client"] default is client
 *  memberShip is Object
 *     memberType:
 *      - 0: default normal member
 *      - 1: member of combo 6
 *      - 2: member of combo 10
 *      - 3: member VIP
 *     expired:
 *      - default is 0: Don't have expired
 *      - Number: timestamp in miliseconds * (24 * 60 * 60 * days)
 */

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    birthDay: {
      type: Number,
    },
    password: {
      type: String,
    },
    ICN: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "client",
    },
    memberShip: {
      memberType: {
        type: Number,
        default: 0,
      },
      expired: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: Date,
  }
);

UserSchema.statics = {
  findByEmail(email) {
    return this.findOne({ email: email }).exec();
  },

  createNew(user) {
    return this.create(user);
  },
};

const User = model("User", UserSchema);

module.exports = {
  User,
  UserSchema,
};
