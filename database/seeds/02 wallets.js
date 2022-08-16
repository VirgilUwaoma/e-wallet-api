/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { v4: uuidv4 } = require("uuid");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("wallets").del();
  await knex("wallets").insert([
    {
      user_id: 1,
      account_balance: 1000.0,
      account_id: uuidv4(),
    },
    {
      user_id: 2,
      account_balance: 1000.0,
      account_id: uuidv4(),
    },
  ]);
};
