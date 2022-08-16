/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      first_name: "User 1",
      last_name: "Users",
      email: "user1@user.com",
      password: "1",
      mobile_number: 1,
    },
    {
      first_name: "User 2",
      last_name: "Users",
      email: "user2@user.com",
      password: "2",
      mobile_number: 2,
    },
  ]);
};
