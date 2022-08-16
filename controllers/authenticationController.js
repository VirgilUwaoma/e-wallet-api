const userModel = require("../models/user");
const walletModel = require("../models/wallet");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { issueToken } = require("../utilities/issueTokens");

async function registerUser(req, res) {
  let request = req.body;
  const reqBodyLength = Object.keys(request).length;
  if (reqBodyLength === 0) {
    return res.status(400).json({ message: "empty request body" });
  }

  if (
    !request.first_name ||
    !request.last_name ||
    !request.password ||
    !request.mobile_number ||
    !request.email
  )
    return res.status(400).json({ message: "required field missing" });

  try {
    const existingEmail = await userModel.getByEmail(request.email);
    const existingMobile = await userModel.getByMobile(request.mobile_number);

    if (existingEmail.length != 0) {
      return res.status(409).json({
        message: `user with email already exists`,
        success: false,
      });
    }
    if (existingMobile.length != 0) {
      return res.status(409).json({
        message: `user with mobile number already exists`,
        success: false,
      });
    }

    const encryptedPassword = await bcrypt.hash(request.password, 10);
    const newUser = {
      first_name: request.first_name,
      last_name: request.last_name,
      email: request.email.toLowerCase(),
      password: encryptedPassword,
      mobile_number: request.mobile_number,
    };
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
      message: `created account for ${newUser.first_name}`,
      sucess: true,
    });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
}

async function loginUser(req, res) {
  const loginDetails = req.body;
  const reqBodyLength = Object.keys(loginDetails).length;
  if (!reqBodyLength) {
    return res
      .status(400)
      .json({ message: "empty request body", success: false });
  }
  if (!loginDetails.email)
    return res.status(400).json({ message: "email required", success: false });
  if (!loginDetails.password)
    return res
      .status(400)
      .json({ message: "password required", success: false });
  try {
    const existingUser = await userModel.getByEmail(loginDetails.email);
    correctPassword = await bcrypt.compare(
      loginDetails.password,
      existingUser[0].password
    );
    if (!correctPassword) {
      return res.status(400).json({ message: "wrong password" });
    }
    const tokenDetails = {
      id: existingUser[0].id,
      email: existingUser[0].email,
      mobile_number: existingUser[0].mobile_number,
      actions: "all",
    };
    const token = await issueToken(tokenDetails);
    return res
      .status(200)
      .json({ message: "login successful", token, success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "user email doesn't exist", success: false });
  }
}
module.exports = {
  registerUser,
  loginUser,
};
