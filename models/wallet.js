const db = require("../database/db_config.js");

//Create new user

function createWallet(wallet) {
  return db("wallets").insert(wallet);
}

module.exports = {
  createWallet,
};
