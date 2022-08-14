const db = require("../database/db_config.js");

const createUser = function (user) {
  return db("users").insert(user);
};

const getByEmail = function (email) {
  return db("users").where("email", email);
};

const getByMobile = function (mobile) {
  return db("users").where("mobile_number", mobile);
};

const deleteUser = function (email) {
  return db("users").where("email", email).del();
};

module.exports = {
  createUser,
  getByEmail,
  getByMobile,
  deleteUser,
};
