var validatorUtilities = require("./validator");

var ChainUtilities = function ChainUtilities() {
  var self = this;

  this.isValidChain = isValidChain;

  function isValidChain(chain) {
    let isValid = true;
    if (chain.length > 0) {
      //not considering the genesis block
      for (var i = 1; i < chain.length; i++) {
        // Each block in the blockchain should have the correct index
        console.log("Starting the loop-|", i);
        const currentBlock = chain[i];
        const previousBlock = chain[i - 1];
        console.log("currentBlock: ", currentBlock);

        //since the index of block started from 1.
        if (currentBlock.index !== i + 1 && previousBlock.index !== i) {
          console.log(" The block's index isnot correct");
          isValid = false;
          break;
        }
        console.log("First test passed !");

        //checks the proof of every block
        if (
          validatorUtilities.generateProof(chain[i].transaction[0]) !==
          chain[i].proof
        ) {
          isValid = false;
          break;
        }
        console.log("Second test passed !!");
        /*
        //to check whether the hash of the previous block is stored correctly or not.
        
        calculateHash When the hash of a block includes dynamic or variable data such as timestamps, it introduces inconsistency because the hash will change whenever the variable data changes. This inconsistency makes it challenging to validate the blockchain, as you cannot rely on the hash of a block to remain constant over time.

        */

        var lastBlockHash = validatorUtilities.calculateHash(
          previousBlock.transaction[0]
        );
        console.log("lastBlockHash", lastBlockHash);
        console.log("chain[i - 1].previousHash", chain[i].previousHash);
        if (lastBlockHash !== chain[i - 1].previousHash) {
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  }

  if (ChainUtilities.caller != ChainUtilities.getInstance) {
    throw new Error("This object cannot be Instanciated");
  }
};

ChainUtilities.instance = null;
ChainUtilities.getInstance = function () {
  if (this.instance === null) {
    this.instance = new ChainUtilities();
  }
  return this.instance;
};

module.exports = ChainUtilities.getInstance();
