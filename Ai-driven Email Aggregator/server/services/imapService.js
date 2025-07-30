const Imap = require('imap');
const Email = require('../models/Email');
const { indexEmail } = require('./elasticsearchService');
const { classifyEmail } = require('./aiService');
const { sendSlackNotification } = require('./notificationService');
const Account = require('../models/Account');

const activeConnections = new Map();

async function connectToAccount(account) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: account.email,
      password: account.password,
      host: account.imapHost,
      port: account.imapPort,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 3000,
    });

    imap.once('ready', () => {
      activeConnections.set(account._id.toString(), imap);
      resolve(imap);
    });

    imap.once('error', (err) => {
      console.error(`IMAP error for ${account.email}:`, err);
      reject(err);
    });

    imap.connect();
  });
}

async function fetchAndProcessEmails(imap, accountId) {
  return new Promise((resolve, reject) => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) return reject(err);

      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 30);

      const searchCriteria = ['UNSEEN', ['SINCE', sinceDate.toISOString().split('T')[0]]];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };

      imap.search(searchCriteria, (err, results) => {
        if (err) return reject(err);
        
        if (results.length === 0) return resolve([]);

        const fetch = imap.fetch(results, fetchOptions);
        const emails = [];

        fetch.on('message', (msg) => {
          let emailData = {};
          
          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', () => {
              if (info.which === 'HEADER') {
                emailData.headers = Imap.parseHeader(buffer);
              } else if (info.which === 'TEXT') {
                emailData.text = buffer;
              }
            });
          });

          msg.on('attributes', (attrs) => {
            emailData.attributes = attrs;
          });

          msg.on('end', () => {
            emails.push(processEmail(emailData, accountId));
          });
        });

        fetch.on('error', reject);
        fetch.on('end', () => resolve(emails));
      });
    });
  });
}

async function processEmail(emailData, accountId) {
  const { headers, text, attributes } = emailData;
  const email = {
    accountId,
    messageId: attributes.uid,
    from: headers.from[0],
    to: headers.to ? headers.to[0] : '',
    subject: headers.subject ? headers.subject[0] : '(No Subject)',
    date: headers.date ? new Date(headers.date[0]) : new Date(),
    body: text,
    labels: [],
    isRead: false,
  };

  const category = await classifyEmail(email);
  email.labels.push(category);

  const savedEmail = await Email.findOneAndUpdate(
    { messageId: email.messageId, accountId },
    email,
    { upsert: true, new: true }
  );

  await indexEmail(savedEmail);

  if (category === 'Interested') {
    await sendSlackNotification(savedEmail);
  }

  return savedEmail;
}

async function startWatchingAccounts() {
  try {
    const accounts = await Account.find({ isActive: true });
    
    for (const account of accounts) {
      try {
        const imap = await connectToAccount(account);
        console.log(`Connected to ${account.email}`);
        
        await fetchAndProcessEmails(imap, account._id);
        
        imap.on('mail', async () => {
          console.log(`New mail detected for ${account.email}`);
          await fetchAndProcessEmails(imap, account._id);
        });
        
        imap.on('error', (err) => {
          console.error(`IMAP error for ${account.email}:`, err);
          activeConnections.delete(account._id.toString());
        });
        
      } catch (err) {
        console.error(`Failed to connect to ${account.email}:`, err);
      }
    }
  } catch (err) {
    console.error('Error watching accounts:', err);
  }
}

module.exports = {
  startWatchingAccounts,
  activeConnections,
};