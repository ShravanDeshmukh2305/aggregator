const Email = require('../models/Email');
const { searchEmails } = require('../services/elasticsearchService');

exports.searchEmails = async (req, res) => {
  try {
    const { q: query } = req.query;
    const filters = {};
    
    if (req.query.accountId) filters.accountId = req.query.accountId;
    if (req.query.label) filters.label = req.query.label;
    
    const results = await searchEmails(query, filters);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmailDetails = async (req, res) => {
  try {
    const email = await Email.findOne({
      accountId: req.params.accountId,
      messageId: req.params.messageId
    });
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      {
        accountId: req.params.accountId,
        messageId: req.params.messageId
      },
      { isRead: true },
      { new: true }
    );
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    await indexEmail(email);
    
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};