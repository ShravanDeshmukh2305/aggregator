const Email = require('../models/Email');
const { generateSuggestedReply } = require('../services/aiService');

exports.getSuggestedReply = async (req, res) => {
  try {
    const email = await Email.findOne({
      accountId: req.params.accountId,
      messageId: req.params.messageId
    });
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    const context = `
      Product: ReachInbox - AI-powered email outreach platform
      Goal: Schedule meetings with interested leads
      Call to action: Share this calendar link: https://cal.com/reachinbox
    `;
    
    const reply = await generateSuggestedReply(email, context);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};