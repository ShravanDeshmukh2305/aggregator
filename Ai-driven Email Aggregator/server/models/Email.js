const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  messageId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, required: true },
  labels: { type: [String], default: [] },
  isRead: { type: Boolean, default: false }
}, { 
  timestamps: true,
  indexes: [
    { accountId: 1, messageId: 1, unique: true },
    { accountId: 1, date: -1 },
    { labels: 1 }
  ]
});

module.exports = mongoose.model('Email', emailSchema);