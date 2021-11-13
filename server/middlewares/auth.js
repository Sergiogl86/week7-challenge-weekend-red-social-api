require("dotenv").config();
const debug = require("debug")("redSsocial:auth");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {
  debug(chalk.yellow("loginAuth Series"));

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    debug(chalk.yellow("falta authHeader"));
    const error = new Error("No estas registrado");
    error.code = 401;
    next(error);
  } else {
    debug(chalk.yellow("correcto authHeader"));
    const token = authHeader.split(" ")[1];
    debug(chalk.yellow(`El Token ${token}`));
    if (!token) {
      debug(chalk.yellow("Token incorrecto"));
      const error = new Error("Necesario token!");
      error.code = 401;
      next(error);
    } else {
      debug(chalk.yellow("Token recogido"));
      try {
        const user = jwt.verify(token, process.env.RED_HASH);
        debug(chalk.blue(`Codificando en Token: ${JSON.stringify(user)}`));
        debug(chalk.blue(`Codificando en Auth: ${user.id}`));
        debug(chalk.blue(`Codificando en Auth: ${user.isAdmin}`));
        req.userid = user.id;
        debug(chalk.yellow("Token correcto"));
        next();
      } catch {
        debug(chalk.yellow("Token incorrecto"));
        const error = new Error("Token incorrecto");
        error.code = 401;
        next(error);
      }
    }
  }
};

module.exports = Auth;
