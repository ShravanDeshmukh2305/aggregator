const Account = require('../models/Account');
const imapService = require('../services/imapService');

exports.addAccount = async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    
    const imap = await imapService.connectToAccount(account);
    await imapService.fetchAndProcessEmails(imap, account._id);
    
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    const imap = imapService.activeConnections.get(req.params.id);
    if (imap) {
      imap.end();
      imapService.activeConnections.delete(req.params.id);
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};