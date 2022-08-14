/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("wallets", function (table) {
    table.increments().primary();
    table.integer("user_id").unsigned();
    table.decimal("account_balance", 9, 2);
    table.uuid("account_id").notNullable().unique();
    table
      .foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("wallets");
};
