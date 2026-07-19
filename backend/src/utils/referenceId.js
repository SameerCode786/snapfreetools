const crypto = require('crypto');

const generateReferenceId = () => {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CNT-${dateStr}-${suffix}`;
};

module.exports = generateReferenceId;
