const db = require("../database/db_config.js");

function newTransaction(transaction) {
  return db("transactions").insert(transaction);
}

module.exports = { newTransaction };
