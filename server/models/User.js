const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const bookSchema = require("./Book");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid address"],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual("bookCount").get(function () {
  return this.savedBooks.length;
});

const User = model("User", userSchema);
module.exports = User;
