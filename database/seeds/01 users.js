/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
require("dotenv").config();
const pwd = require("../../utilities/encryptPassword");
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      first_name: "User 1",
      last_name: "Users",
      email: "user1@user.com",
      password: pwd.pwd1,
      mobile_number: 1,
    },
    {
      first_name: "User 2",
      last_name: "Users",
      email: "user2@user.com",
      password: pwd.pwd2,
      mobile_number: 2,
    },
  ]);
};
