const express = require("express");
const { validate } = require("express-validation");
const { getusers } = require("../controller/usersController");
const userValidation = require("../schemas/userSchema");

const router = express.Router();

/* router.post("/register", validate(userValidation), addUser); */
router.get("/all", getusers);
/* router.post("/login", validate(userValidation), loginUser); */

module.exports = router;
