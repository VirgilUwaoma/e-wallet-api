const bcrypt = require("bcrypt");

pwd1 = bcrypt.hashSync("1", 10);
pwd2 = bcrypt.hashSync("2", 10);

module.exports = { pwd1, pwd2 };
