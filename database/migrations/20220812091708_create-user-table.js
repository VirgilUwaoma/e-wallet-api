/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments().primary();
    table.string("first_name");
    // table.string("last_name");
    // table.string("email").unique();
    // table.string("password");
    // // table.string("mobile_number").unique();
    // table.timestamps(true, true, false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
