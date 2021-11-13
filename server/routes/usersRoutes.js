const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const path = require("path");
const { getusers, addUser } = require("../controller/usersController");
const firebase = require("../middlewares/firebase");

const userValidation = require("../schemas/userSchema");

const upload = multer({
  storage: multer.diskStorage({
    destination: "IMG",
    filename: (req, file, callback) => {
      const oldFilename = file.originalname;
      const oldFilenameExtension = path.extname(oldFilename);
      const oldFilenameWithoutExtension = oldFilename.replace(
        oldFilenameExtension,
        ""
      );

      const newFilename = `API_Sergio-${oldFilenameWithoutExtension}-${Date.now()}-${oldFilenameExtension}`;

      callback(null, newFilename);
    },
  }),
});

const router = express.Router();

router.get("/all", getusers);
router.post(
  "/register",
  upload.single("img"),
  firebase,
  validate(userValidation),
  addUser
);
/* router.post("/login", validate(userValidation), loginUser); */

module.exports = router;
