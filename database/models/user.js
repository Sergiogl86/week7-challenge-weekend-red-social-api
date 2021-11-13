const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    max: 130,
    min: 16,
    required: true,
  },
  bio: {
    type: String,
    maxLength: 100,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imageLocal: {
    type: String,
    required: true,
  },
  friends: {
    type: [Types.ObjectId],
    ref: "User",
    required: true,
  },
  enemies: {
    type: [Types.ObjectId],
    ref: "User",
    required: true,
  },
});

const User = model("User", userSchema, "users");

module.exports = User;
