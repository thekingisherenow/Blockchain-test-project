var validatorUtilities = require("./validator");

var ChainUtilities = function ChainUtilities() {
  var self = this;

  this.isValidChain = isValidChain;

  function isValidChain(chain) {
    let isValid = true;
    if (chain.length > 0) {
      for (var i = 1; i < chain.length; i++) {
        /*calculateHash When the hash of a block includes dynamic or variable data such as timestamps, it introduces inconsistency because the hash will change whenever the variable data changes. This inconsistency makes it challenging to validate the blockchain, as you cannot rely on the hash of a block to remain constant over time.

        // var lastBlockHash = calculateHash(chain[i - 1]);
        // if (lastBlockHash !== chain[i].previousHash) {
        //   return false;
        // }
*/

        // Each block in the blockchain should have the correct index

        console.log("Starting the loop-|", i);
        const currentBlock = self.chain[i - 1];
        console.log("currentBlock: ", currentBlock);

        if (currentBlock.index !== i) {
          console.log(" The block's index isnot correct");
          isValid = false;
          break;
        }
        //

        //checks the proof of every block
        if (
          validatorUtilities.generateProof(chain[i].transaction[0]) !==
          chain[i].proof
        ) {
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
