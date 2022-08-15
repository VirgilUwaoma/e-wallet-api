const db = require("../database/db_config.js");

function createWallet(wallet) {
  return db("wallets").insert(wallet);
}

function getWalletByUserId(id) {
  return db("wallets").where("user_id", id);
}

function updateWalletBalance(id, balance) {
  return db("wallets")
    .where("user_id", id)
    .update({ account_balance: balance });
}

module.exports = {
  createWallet,
  getWalletByUserId,
  updateWalletBalance,
};
