const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const path = require("path");
const Auth = require("../middlewares/auth");
const {
  getusers,
  addUser,
  loginUser,
  getMembers,
  getUserProfile,
  updateProfileUser,
  addFriends,
  addEnemies,
  getFriends,
  getEnemies,
} = require("../controller/usersController");
const firebase = require("../middlewares/firebase");

const {
  userValidation,
  userLoginValidation,
} = require("../schemas/userSchema");

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

router.get("/all", Auth, getusers);
router.get("/members", Auth, getMembers);
router.post(
  "/register",
  upload.single("img"),
  firebase,
  validate(userValidation),
  addUser
);

router.put(
  "/updateProfile",
  upload.single("img"),
  firebase,
  validate(userValidation),
  Auth,
  updateProfileUser
);

router.get("/userProfile", Auth, getUserProfile);
router.post("/login", validate(userLoginValidation), loginUser);
router.get("/friends", Auth, getFriends);
router.get("/enemies", Auth, getEnemies);
router.put("/friends", Auth, addFriends);
router.put("/enemies", Auth, addEnemies);

module.exports = router;
