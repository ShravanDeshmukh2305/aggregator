const axios = require('axios');
const config = require('../config/config');

async function sendSlackNotification(email) {
  if (!config.slack.webhookUrl) return;
  
  try {
    await axios.post(config.slack.webhookUrl, {
      text: `New interested email from ${email.from}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Interested Email* :email:`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*From:*\n${email.from}`
            },
            {
              type: 'mrkdwn',
              text: `*Subject:*\n${email.subject}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Preview:*\n${email.body.substring(0, 200)}...`
          }
        }
      ]
    });
  } catch (err) {
    console.error('Error sending Slack notification:', err);
  }
}

async function triggerWebhook(email) {
  const webhookUrl = 'https://webhook.site/your-unique-url';
  try {
    await axios.post(webhookUrl, {
      event: 'interested_email',
      data: email
    });
  } catch (err) {
    console.error('Error triggering webhook:', err);
  }
}

module.exports = {
  sendSlackNotification,
  triggerWebhook,
};