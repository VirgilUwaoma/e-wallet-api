const userModel = require("../models/user");
const walletModel = require("../models/wallet");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

async function registerUser(req, res) {
  let user = req.body;
  const reqBodyLength = Object.keys(user).length;
  if (!user || reqBodyLength != 5) {
    return res.status(400).json({ message: "malformed request body" });
  }
  //consider refactor below to switch case
  if (!user.first_name)
    return res.status(400).json({ message: "First is name required" });
  if (!user.last_name)
    return res.status(400).json({ message: "Lastname is required" });
  if (!user.email)
    return res.status(400).json({ message: "Email is required" });
  if (!user.password)
    return res.status(400).json({ message: "Password is required" });
  if (!user.mobile_number)
    return res.status(400).json({ message: "Mobile number is required" });
  try {
    const existingEmail = await userModel.getByEmail(user.email);
    const existingMobile = await userModel.getByMobile(user.mobile_number);
    console.log(userModel.getByEmail(user.email));

    if (existingEmail.length != 0 || existingMobile.length != 0) {
      return res
        .status(409)
        .json({ message: `User with email or mobile numer already exists` });
    }
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.email, saltRounds);
    user.email = user.email.toLowerCase();
    await userModel.createUser(user);
    const retrieveUser = await userModel.getByEmail(user.email);
    try {
      const wallet = {
        user_id: retrieveUser[0].id,
        account_balance: 0.0,
        account_id: uuidv4(),
      };
      await walletModel.createWallet(wallet);
    } catch (error) {
      await userModel.deleteUser(user.email);
      return res.status(500).json({ message: "couldn't create wallet" });
    }
    res
      .status(201)
      .json({ message: `Created account for ${user.first_name.properCase()}` });
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
}

module.exports = {
  registerUser,
};
