require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT;
const server = express();

const authRoutes = require("./routes/auth.js");

server.use(express.json());
server.use("/api/v1/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}\n`);
});
