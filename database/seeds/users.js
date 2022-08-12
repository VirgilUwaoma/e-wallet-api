/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    { id: 1, first_name: "Virgil" },
    { id: 2, first_name: "Dev" },
    { id: 3, first_name: "Senior" },
  ]);
};
