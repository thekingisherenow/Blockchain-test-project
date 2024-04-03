var addressUtilities = require("../utils/address");
var arrayUtilities = require("../utils/array");
var validator = require("../utils/validator");
var chain = require("../utils/chain");

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

  function init() {
    /*
     *  initialize the blockchain, creating a new empty chain,
     *  an empty transactions list and creating the first block
     */
    self.chain = [];
    //the transaction being empty is causing the previous Hash of 2nd block to be false.
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

    if (!chain.isValidChain(self.chain)) {
      console.log("invalid chain");
      isValid = false;
    }

    // for (let i = 1; i <= self.chain.length; i++) {
    //   console.log("Starting the loop-|", i);
    //   const currentBlock = self.chain[i - 1];

    //   // Each block in the blockchain should have the correct index
    //   if (currentBlock.index !== i) {
    //     console.log(" The block's index isnot correct");
    //     isValid = false;
    //     break;
    //   }

    // }

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
