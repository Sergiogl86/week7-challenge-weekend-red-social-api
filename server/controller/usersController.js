require("dotenv").config();
const chalk = require("chalk");
const debug = require("debug")("redSsocial:usersController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

const getusers = async (req, res, next) => {
  try {
    const users = await User.find();
    debug(chalk.blue("Haciendo un get a /redSocial/all"));
    res.json(users);
  } catch (error) {
    error.code = 400;
    error.message = "Datos erroneos!";
    next(error);
  }
};

module.exports = {
  getusers,
};
