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

const addUser = async (req, res, next) => {
  const userBody = req.body;
  debug(chalk.blue("Haciendo un post a redSocial/register"));
  debug(chalk.blue("Nos llega en el body el user ->"));
  debug(chalk.blue(JSON.stringify(userBody)));
  debug(chalk.blue("Nos llega en req.file el file ->"));
  debug(chalk.blue(JSON.stringify(req.file)));
  userBody.image = req.file.fileURL;
  userBody.imageLocal = req.file.path;
  userBody.password = await bcrypt.hash(userBody.password, 10);
  debug(chalk.blue("Modifico el body el user ->"));
  debug(chalk.blue(JSON.stringify(userBody)));
  try {
    debug(chalk.blue("Creando usuario en el endpoint /redSocial/register"));
    const users = await User.create(userBody);
    debug(chalk.blue(`Hemos creado el usuario ${users}`));
    res.json(users);
  } catch (problem) {
    debug(chalk.blue("El detonante el catch es->"));
    debug(chalk.blue(problem));
    const error = new Error("Datos erroneos!");
    error.code = 400;
    debug(
      chalk.blue(`Hemos creado el error de usuario ${JSON.stringify(error)}`)
    );
    next(error);
  }
};

module.exports = {
  getusers,
  addUser,
};
