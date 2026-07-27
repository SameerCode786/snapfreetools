const limits = require('../constants/wordToPdfLimits');

let activeConversions = 0;

module.exports = {
  acquire: () => {
    if (activeConversions >= limits.MAX_CONCURRENT) {
      return false;
    }
    activeConversions++;
    return true;
  },
  release: () => {
    if (activeConversions > 0) activeConversions--;
  },
  getActiveCount: () => activeConversions
};
