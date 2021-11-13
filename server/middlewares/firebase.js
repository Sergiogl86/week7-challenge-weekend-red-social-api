const admin = require("firebase-admin");
const chalk = require("chalk");
const debug = require("debug")("redSsocial:filebase");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "skylab-sergio-red-social-api.appspot.com",
});

const firebase = async (req, res, next) => {
  const bucket = admin.storage().bucket();
  await bucket.upload(req.file.path);
  await bucket.file(req.file.filename).makePublic();
  const fileURL = bucket.file(req.file.filename).publicUrl();
  debug(chalk.green("Url de la imagen ->"));
  debug(chalk.green(fileURL));
  req.file.fileURL = fileURL;
  next();
};

module.exports = firebase;
