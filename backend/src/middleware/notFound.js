const notFound = (req, res) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Endpoint not found.' });
};

module.exports = notFound;
