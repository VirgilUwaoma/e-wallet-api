require("dotenv").config();
const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader == "undefined")
      return res.status(403).json({ message: "invalid token" });
    const bearer = bearerHeader.split(" ");
    if (bearer.length != 2 || bearer[0] !== "Bearer")
      return res.status(403).json({ message: "invalid token" });
    const bearerToken = bearer[1];

    const verifiedToken = await jwt.verify(bearerToken, process.env.SECRET_KEY);
    req.body.verifiedUser = verifiedToken;
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
  next();
}

module.exports = verifyToken;
