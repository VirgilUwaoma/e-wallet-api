const knex = require("knex");
const knexFile = require("../knexfile");

const env = "development";
const options = knexFile[env];

module.exports = knex(options);
