const userModel = require("../models/user");
const walletModel = require("../models/wallet");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { issueToken } = require("../utilities/issueTokens");

async function registerUser(req, res) {
  let request = req.body;
  const reqBodyLength = Object.keys(request).length;
  if (!request || reqBodyLength != 5) {
    return res.status(400).json({ message: "malformed request body" });
  }
  //consider refactor below to switch case
  if (!request.first_name)
    return res.status(400).json({ message: "First is name required" });
  if (!request.last_name)
    return res.status(400).json({ message: "Lastname is required" });
  if (!request.email)
    return res.status(400).json({ message: "Email is required" });
  if (!request.password)
    return res.status(400).json({ message: "Password is required" });
  if (!request.mobile_number)
    return res.status(400).json({ message: "Mobile number is required" });
  try {
    const existingEmail = await userModel.getByEmail(request.email);
    const existingMobile = await userModel.getByMobile(request.mobile_number);

    if (existingEmail.length != 0 || existingMobile.length != 0) {
      return res
        .status(409)
        .json({ message: `User with email or mobile numer already exists` });
    }

    const encryptedPassword = await bcrypt.hash(request.password, 10);
    const newUser = {
      first_name: request.first_name,
      last_name: request.last_name,
      email: request.email.toLowerCase(),
      password: encryptedPassword,
      mobile_number: request.mobile_number,
    };
    console.log(newUser);
    await userModel.createUser(newUser);
    const retrieveUser = await userModel.getByEmail(newUser.email);
    try {
      const wallet = {
        user_id: retrieveUser[0].id,
        account_balance: 0.0,
        account_id: uuidv4(),
      };
      await walletModel.createWallet(wallet);
    } catch (error) {
      await userModel.deleteUser(newUser.email);
      return res.status(500).json({ message: error.message });
    }
    res.status(201).json({
      message: `Created account for ${newUser.first_name}`,
    });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
}

async function loginUser(req, res) {
  const loginDetails = req.body;
  const reqBodyLength = Object.keys(loginDetails).length;
  if (!reqBodyLength || reqBodyLength != 2) {
    return res.status(400).json({ message: "malformed request body" });
  }
  if (!loginDetails.email)
    return res.status(400).json({ message: "email required" });
  if (!loginDetails.password)
    return res.status(400).json({ message: "password required" });
  try {
    const existingUser = await userModel.getByEmail(loginDetails.email);
    correctPassword = await bcrypt.compare(
      loginDetails.password,
      existingUser[0].password
    );
    if (!correctPassword)
      return res.status(400).json({ message: "wrong password" });
    const tokenDetails = {
      id: existingUser[0].id,
      email: existingUser[0].email,
      mobile_number: existingUser[0].mobile_number,
      actions: "all",
    };
    const token = await issueToken(tokenDetails);
    return res.status(200).json({ message: "login successful", token });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
}
module.exports = {
  registerUser,
  loginUser,
};
