const jwt = require("jsonwebtoken");

function issueToken(user) {
  const token = jwt.sign(user, process.env.SECRET_KEY);
  return token;
}
module.exports = { issueToken };
