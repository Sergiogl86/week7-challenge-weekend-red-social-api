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

const getMembers = async (req, res, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userid } },
      "username name id image imageLocal bio age"
    );
    debug(chalk.blue("Haciendo un get a /redSocial/all"));
    res.json(users);
  } catch (error) {
    error.code = 400;
    error.message = "Datos erroneos!";
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const users = await User.findById(
      req.userid,
      "username name id image imageLocal bio age"
    );
    debug(chalk.blue("Haciendo un get a /redSocial/userProfile"));
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
    res.json({ user: "Creado correctamente!" });
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

const updateProfileUser = async (req, res, next) => {
  const userBody = req.body;
  debug(chalk.blue("Haciendo un put a redSocial/updateProfile"));
  debug(chalk.blue("Nos llega en el body el user ->"));
  debug(chalk.blue(JSON.stringify(userBody)));
  debug(chalk.blue("Nos llega en req.file el file ->"));
  debug(chalk.blue(JSON.stringify(req.file)));
  userBody.image = req.file.fileURL;
  userBody.imageLocal = req.file.path;
  userBody.id = req.userid;
  userBody.password = await bcrypt.hash(userBody.password, 10);
  debug(chalk.blue("Modifico el body el user ->"));
  debug(chalk.blue(JSON.stringify(userBody)));
  try {
    debug(
      chalk.blue("Modificando usuario en el endpoint /redSocial/updateProfile")
    );
    const users = await User.findByIdAndUpdate(req.userid, userBody, {
      select: "username name id image imageLocal bio age",
      new: true,
    });
    debug(chalk.blue(`Hemos modificado el usuario ${users}`));
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
      debug(chalk.blue(`Codificando: ${user.username}`));
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          name: user.name,
          age: user.age,
          bio: user.bio,
          image: user.image,
          imageLocal: user.imageLocal,
          friends: user.friends,
          enemies: user.enemies,
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

const addFriends = async (req, res, next) => {
  debug(chalk.blue("Haciendo un post a /redSocial/friends"));
  const { friendId } = req.body;
  debug(chalk.blue(friendId));
  const user = await User.findById(friendId);
  if (!user) {
    const error = new Error("Wrong credentials");
    error.code = 401;
    next(error);
  } else {
    debug(chalk.blue("Busco el usuario"));
    debug(chalk.blue(user));
    debug(chalk.blue("Me busco"));
    const loggedUser = await User.findById(req.userid);
    debug(chalk.blue(loggedUser));
    loggedUser.friends = [...loggedUser.friends, user.id];
    debug(chalk.blue("Añado el amigo!"));
    debug(chalk.blue(loggedUser));
    await loggedUser.save();
    const loggedUserUpdate = await User.findById(
      req.userid,
      "username name id image imageLocal bio age friends enemies"
    );
    debug(chalk.blue("Resulatado final!"));
    debug(chalk.blue(loggedUserUpdate));
    res.json(loggedUserUpdate);
  }
};

const addEnemies = async (req, res, next) => {
  debug(chalk.blue("Haciendo un post a /redSocial/enemies"));
  const { enemieId } = req.body;
  debug(chalk.blue(enemieId));
  const user = await User.findById(enemieId);
  if (!user) {
    const error = new Error("Wrong credentials");
    error.code = 401;
    next(error);
  } else {
    debug(chalk.blue("Busco el usuario"));
    debug(chalk.blue(user));
    debug(chalk.blue("Me busco"));
    const loggedUser = await User.findById(req.userid);
    debug(chalk.blue(loggedUser));
    loggedUser.enemies = [...loggedUser.enemies, user.id];
    debug(chalk.blue("Añado el enemigo!"));
    debug(chalk.blue(loggedUser));
    await loggedUser.save();
    const loggedUserUpdate = await User.findById(
      req.userid,
      "username name id image imageLocal bio age friends enemies"
    );
    debug(chalk.blue("Resulatado final!"));
    debug(chalk.blue(loggedUserUpdate));
    res.json(loggedUserUpdate);
  }
};

const getFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.userid).populate({
      path: "friends",
      select: "username name id image imageLocal bio age",
    });
    debug(chalk.blue("Haciendo un get a /redSocial/friends"));
    res.json(user.friends);
  } catch (error) {
    error.code = 400;
    error.message = "Datos erroneos!";
    next(error);
  }
};

const getEnemies = async (req, res, next) => {
  try {
    const user = await User.findById(req.userid).populate({
      path: "enemies",
      select: "username name id image imageLocal bio age",
    });
    debug(chalk.blue("Haciendo un get a /redSocial/friends"));
    res.json(user.enemies);
  } catch (error) {
    error.code = 400;
    error.message = "Datos erroneos!";
    next(error);
  }
};

module.exports = {
  getusers,
  addUser,
  loginUser,
  getFriends,
  getEnemies,
  addFriends,
  addEnemies,
  getMembers,
  getUserProfile,
  updateProfileUser,
};
