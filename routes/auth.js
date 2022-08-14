const express = require("express");
const authController = require("../controllers/authenticationController");

const router = express.Router();

router.post("/register", authController.registerUser);

module.exports = router;
