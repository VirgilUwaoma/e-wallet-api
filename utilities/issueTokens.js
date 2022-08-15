const jwt = require("jsonwebtoken");

function issueToken(user) {
  const token = jwt.sign(user, "secretkey");
  return token;
}
module.exports = { issueToken };
