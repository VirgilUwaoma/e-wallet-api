require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const server = express();
const port = process.env.PORT;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  mas: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");

server.use(express.json());
server.use("/api/v1/auth", authRoutes);
server.use("/api/v1/wallet", walletRoutes);
server.use(helmet());
server.use(limiter);

server.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

module.exports = server;

server.listen(port, () => {
  console.log(`\nServer running on port ${port}\n`);
});
