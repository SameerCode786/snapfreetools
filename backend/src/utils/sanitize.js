const escapeHTML = (str) => {
  return str.replace(/[&<>'\"/]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
    '/': '&#x2F;'
  }[tag]));
};

const normalizeText = (str) => {
  return str.replace(/\r\n/g, '\n').trim();
};

module.exports = { escapeHTML, normalizeText };
