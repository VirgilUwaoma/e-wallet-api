require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT;
const server = express();

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");

server.use(express.json());
server.use("/api/v1/auth", authRoutes);
server.use("/api/v1/wallet", walletRoutes);

server.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

module.exports = server;

server.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}\n`);
});
