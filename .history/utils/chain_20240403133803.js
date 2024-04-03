var validatorUtilities = require("./validator");

var ChainUtilities = function ChainUtilities() {
  var self = this;

  this.isValidChain = isValidChain;

  function isValidChain(chain) {
    if (chain.length > 0) {
      for (var i = 1; i <= chain.length; i++) {
        //calculateHash creates a new hash on the time of the transaction and thus cannot be checked properly because it cannot be replicated

        // var lastBlockHash = calculateHash(chain[i - 1]);
        // if (lastBlockHash !== chain[i].previousHash) {
        //   return false;
        // }

        if (
          validatorUtilities.generateProof(chain[i - 1].transaction[0]) !==
          chain[i - 1].proof
        ) {
          return false;
        }
      }
    }
    return true;
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
