const userModel = require("../models/user");
const walletModel = require("../models/wallet");
const transactionModel = require("../models/transaction");
const { v4: uuidv4 } = require("uuid");

async function fundWallet(req, res) {
  try {
    const request = req.body;
    if (!request.amount || typeof request.amount !== "number")
      return res
        .status(400)
        .json({ message: "fund amount required", success: false });
    if (request.amount <= 0)
      return res
        .status(400)
        .json({ message: "amount cannot be zero or negative", success: false });

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
        message: `wallet credited ${request.amount}`,
        balance: newBalance,
        transaction_id: transactionId,
        success: true,
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
        success: false,
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

async function transfer(req, res) {
  let request = req.body;
  try {
    if (!request.amount || typeof request.amount !== "number")
      return res.status(400).json({ message: "transfer amount required" });
    if (request.amount <= 0)
      return res
        .status(400)
        .json({ message: "amount cannot be zero or negative" });
    if (!request.receiver_mobile)
      return res
        .status(400)
        .json({ message: "receiver mobile number required" });

    const senderWallet = await walletModel.getWalletByUserId(
      request.verifiedUser.id
    );
    const receiverWallet = await walletModel.getWalletByUserMobile(
      request.receiver_mobile
    );
    if (receiverWallet[0].user_id == senderWallet[0].user_id)
      return res
        .status(400)
        .json({ message: "Cannot transfer to your own wallet" });

    const senderCurrBalance = senderWallet[0].account_balance;
    const senderNewBalance = senderCurrBalance - request.amount;
    if (senderNewBalance < 0)
      return res.status(400).json({
        message: "insufficient funds",
        amount: request.amount,
        balance: senderCurrBalance,
      });

    const receiverCurrBalance = receiverWallet[0].account_balance;
    const receiverNewBalance = receiverCurrBalance + request.amount;

    const transactionId = uuidv4();
    const transactionDetails = {
      transaction_id: transactionId,
      sender_id: senderWallet[0].user_id,
      receiver_id: receiverWallet[0].user_id,
      amount: request.amount,
      transaction_type: "Transfer",
      successful: true,
    };

    try {
      await walletModel.updateWalletBalance(
        senderWallet[0].user_id,
        senderNewBalance
      );

      await walletModel.updateWalletBalance(
        receiverWallet[0].user_id,
        receiverNewBalance
      );
      await transactionModel.newTransaction(transactionDetails);
      res.status(200).json({
        message: "transfer to successful",
        amount: request.amount,
        prev_balance: senderCurrBalance,
        current_balance: senderNewBalance,
        transaction_id: transactionId,
      });
    } catch (error) {
      await walletModel.updateWalletBalance(
        senderWallet[0].user_id,
        senderCurrBalance
      );
      await walletModel.updateWalletBalance(
        receiverWallet[0].user_id,
        receiverCurrBalance
      );
      transactionDetails.successful = false;
      await transactionModel.newTransaction(transactionDetails);
      return res.status(500).json({
        error: error.message,
        message: "transaction failed",
        amount: request.amount,
        balance: senderCurrBalance,
        transaction_id: transactionId,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { fundWallet, withdraw, transfer };
