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

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  debug(chalk.blue("Haciendo un post a /redSocial/login"));
  debug(chalk.blue("loginUser"));
  debug(chalk.blue(username));
  debug(chalk.blue(password));
  const user = await User.findOne({ username });
  debug(chalk.blue(`El usuario encontrado es ${JSON.stringify(user)}`));
  debug(chalk.blue(user));
  if (!user) {
    const error = new Error("Wrong credentials");
    error.code = 401;
    debug(chalk.blue(`El usuario no existe ${JSON.stringify(error)}`));
    next(error);
  } else {
    const contraseñaOK = await bcrypt.compare(password, user.password);
    debug(chalk.blue(contraseñaOK));
    if (!contraseñaOK) {
      const error = new Error("Wrong credentials");
      error.code = 401;
      next(error);
    } else {
      debug(chalk.blue("Seguimos para generar el Token!"));
      debug(chalk.blue(`Codificando: ${user.id}`));
      debug(chalk.blue(`Codificando: ${user.userName}`));
      const token = jwt.sign(
        {
          id: user.id,
          userName: user.userName,
        },
        process.env.RED_HASH,
        {
          expiresIn: 24 * 60 * 60,
        }
      );
      res.json({ token });
    }
  }
};

module.exports = {
  getusers,
  addUser,
  loginUser,
};
