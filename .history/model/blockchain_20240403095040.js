var addressUtilities = require("../utils/address");
var arrayUtilities = require("../utils/array");
var validator = require("../utils/validator");

var blockchain = function blockchain() {
  var self = this;

  this.init = init;
  this.newBlock = newBlock;
  this.newTransaction = newTransaction;
  this.getChain = getChain;
  this.checkChain = checkChain;
  this.mine = mine;

  this.chain;
  this.currentTransactions;
  //the transaction being empty is causing the previous Hash of 2nd block to be false.
  function init() {
    /*
     *  initialize the blockchain, creating a new empty chain,
     *  an empty transactions list and creating the first block
     */
    self.chain = [];
    self.currentTransactions = [
      {
        sender: 0,
        receiver: "99552212",
        amount: 1,
      },
    ];
    self.newBlock(100, 1);
  }

  function getChain() {
    /*
     *  returns the chain
     */
    return self.chain;
  }

  function mine(miner) {
    /*
     *  implements the mining function. simple as is, it just
     *  creates a new transaction with "sender" 0 to show that
     *  this is a mined block.
     */

    var lastBlock = self.chain[self.chain.length - 1];
    var transaction = newTransaction(0, miner, 1);
    var proof = validator.generateProof(transaction);
    var previousHash = validator.calculateHash(lastBlock.transaction[0]);
    return newBlock(proof, previousHash);
  }

  function newBlock(proof, previousHash) {
    /*
     *  Generate a new blocks and adds it to the chain
     */
    var block = {
      index: self.chain.length + 1,
      timestamp: new Date().getTime(),
      transaction: self.currentTransactions,
      proof: proof,
      previousHash: previousHash,
    };
    self.currentTransactions = [];
    self.chain.push(block);
    return block;
  }

  function newTransaction(sender, receiver, amount) {
    /*
     *  Generate a new transaction
     */
    var transaction = {
      sender: sender,
      receiver: receiver,
      amount: amount,
    };
    self.currentTransactions.push(transaction);
    return transaction;
  }

  function checkChain() {
    let isValid = true;

    console.log("checkChain");
    console.log("self.chain.length", self.chain.length);

    for (let i = 1; i <= self.chain.length; i++) {
      console.log("Starting the loop-|", i);
      console.log("inside for loop");
      const currentBlock = self.chain[i - 1];
      console.log("currentBlock: ", currentBlock);
      console.log("currentBlock.index: ", currentBlock.index);

      // Skip validation for the genesis block
      if (i > 1) {
        console.log("previous block not checked for genesis block");
        previousBlock = self.chain[i - 2];
        console.log("previousBlock: ", previousBlock);
      }

      // Each block in the blockchain should have the correct index
      if (currentBlock.index !== i) {
        console.log(" The block's index isnot correct");
        isValid = false;
        break;
      }
      console.log("First test passed");

      // Check if the previous hash matches

      //this if statement shouldnot run for i = 1;
      if (i > 1) {
        console.log("second test starts !!");

        console.log("currentBlock.previousHash", currentBlock.previousHash);

        console.log(
          "validator.calculateHash(previousBlock)",
          validator.calculateHash(previousBlock)
        );
        if (
          currentBlock.previousHash !== validator.calculateHash(previousBlock)
        ) {
          console.log("Check if the previous hash matches");

          isValid = false;
          break;
        }
      }

      console.log("Second test passed");

      // Check if the proof of work is valid
      // if (
      //   !validator.validateProof(
      //     currentBlock.transaction[0],
      //     currentBlock.proof
      //   )
      // ) {
      //   console.log("Check if the proof of work is valid");

      //   isValid = false;
      //   break;
      // }
    }

    return isValid ? self.chain : [];
  }

  if (blockchain.caller != blockchain.getInstance) {
    throw new Error("This object cannot be instanciated");
  }
};

blockchain.instance = null;
blockchain.getInstance = function () {
  if (this.instance === null) {
    this.instance = new blockchain();
  }
  return this.instance;
};

module.exports = blockchain.getInstance();
