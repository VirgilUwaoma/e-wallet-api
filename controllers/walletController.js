const userModel = require("../models/user");
const walletModel = require("../models/wallet");
const transactionModel = require("../models/transaction");
const { v4: uuidv4 } = require("uuid");

async function fundWallet(req, res) {
  try {
    const request = req.body;
    if (!request.amount || typeof request.amount !== "number")
      return res.status(400).json({ message: "fund amount required" });
    if (request.amount <= 0)
      return res
        .status(400)
        .json({ message: "amount cannot be zero or negative" });

    const transactionId = uuidv4();
    const transactionDetails = {
      transaction_id: transactionId,
      sender_id: request.verifiedUser.id,
      receiver_id: request.verifiedUser.id,
      amount: request.amount,
      transaction_type: "Fund",
      successful: true,
    };

    const retrieveWallet = await walletModel.getWalletByUserId(
      request.verifiedUser.id
    );
    const currentBalance = retrieveWallet[0].account_balance;
    const newBalance = currentBalance + request.amount;

    try {
      await walletModel.updateWalletBalance(
        request.verifiedUser.id,
        newBalance
      );

      await transactionModel.newTransaction(transactionDetails);

      return res.status(200).json({
        message: "wallet credited",
        amount: request.amount,
        balance: newBalance,
        transaction_id: transactionId,
      });
    } catch (error) {
      await walletModel.updateWalletBalance(
        request.verifiedUser.id,
        currentBalance
      );
      transactionDetails.successful = false;
      await transactionModel.newTransaction(transactionDetails);
      return res.status(500).json({
        error: error.message,
        message: "transaction failed",
        amount: request.amount,
        balance: currentBalance,
        transaction_id: transactionId,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function withdraw(req, res) {
  try {
    const request = req.body;
    if (!request.amount || typeof request.amount !== "number")
      return res.status(400).json({ message: "withdrawal amount required" });
    if (request.amount <= 0)
      return res
        .status(400)
        .json({ message: "amount cannot be zero or negative" });

    const transactionId = uuidv4();
    const transactionDetails = {
      transaction_id: transactionId,
      sender_id: request.verifiedUser.id,
      receiver_id: request.verifiedUser.id,
      amount: request.amount,
      transaction_type: "Withdrawal",
      successful: true,
    };

    const retrieveWallet = await walletModel.getWalletByUserId(
      request.verifiedUser.id
    );
    const currentBalance = retrieveWallet[0].account_balance;
    const newBalance = currentBalance - request.amount;
    if (newBalance < 0)
      return res.status(400).json({
        message: "insufficient funds",
        amount: request.amount,
        balance: currentBalance,
      });

    try {
      await walletModel.updateWalletBalance(
        request.verifiedUser.id,
        newBalance
      );
      await transactionModel.newTransaction(transactionDetails);

      return res.status(200).json({
        message: "withdraw successful",
        amount: request.amount,
        balance: newBalance,
        transaction_id: transactionId,
      });
    } catch (error) {
      await walletModel.updateWalletBalance(
        request.verifiedUser.id,
        currentBalance
      );
      transactionDetails.successful = false;
      await transactionModel.newTransaction(transactionDetails);
      return res.status(500).json({
        error: error.message,
        message: "transaction failed",
        amount: request.amount,
        balance: currentBalance,
        transaction_id: transactionId,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { fundWallet, withdraw };
