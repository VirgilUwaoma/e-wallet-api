const express = require("express");
const verifyToken = require("../utilities/verifyToken");
const walletController = require("../controllers/walletController");

const router = express.Router();

router.post("/fund", verifyToken, walletController.fundWallet);

module.exports = router;
