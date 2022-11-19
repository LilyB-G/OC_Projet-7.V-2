const bcrypt = require('bcrypt');
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();



// get all users
router.get("/",  auth, userCtrl.findAll);

// get single user by id
router.get("/:id",  auth,  userCtrl.getSingleUser);

// post new user
router.post("/signup", userCtrl.signup);

// login
router.post("/login", userCtrl.login);

// delete user
router.delete("/:id", auth,  userCtrl.deleteUser);


module.exports = router;
