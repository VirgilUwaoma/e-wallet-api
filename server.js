require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT;
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ hello: "future senior dev" });
});

server.get("/user", async function (req, res) {
  const users = await db("users");
  res.json({ users });
});

server.post("/user", async (req, res) => {
  const user = req.body;
  await db("users").insert(user);
  res.status(201).json(user);
});

server.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}\n`);
});
