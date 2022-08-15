/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", function (table) {
    table.increments().primary();
    table.uuid("transaction_id").unique().notNullable();
    table.integer("sender_id").unsigned();
    table.integer("receiver_id").unsigned();
    table.decimal("amount", 9, 2).notNullable;
    table.boolean("successful").notNullable();
    table.enum("transaction_type", ["Fund", "Withdrawal", "Transfer"]);
    table.timestamp("transaction_time").defaultTo(knex.fn.now());
    table.foreign("sender_id").references("users.id");
    table.foreign("receiver_id").references("users.id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("transactions");
};
