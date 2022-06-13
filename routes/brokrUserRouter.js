const express = require('express');
const router = express.Router();

const brokrUserController = require("../controller/brokrUserController");
const authenticationService = require("../services/authentication.js");

router.use(authenticationService.authenticateJWT)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register",brokrUserController.registerUser);
router.post("/login",brokrUserController.loginUser);
router.get("/getUser",brokrUserController.getUserData);

module.exports = router;
