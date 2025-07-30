const { OpenAI } = require('openai');
const config = require('../config/config');

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

async function classifyEmail(email) {
  try {
    const prompt = `
      Categorize the following email into one of these categories:
      - Interested
      - Meeting Booked
      - Not Interested
      - Spam
      - Out of Office
      
      Email Subject: ${email.subject}
      Email Body: ${email.body.substring(0, 1000)}
      
      Respond with only the category name.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 20,
    });

    const category = response.choices[0].message.content.trim();
    const validCategories = ['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'];
    
    return validCategories.includes(category) ? category : 'Not Interested';
  } catch (err) {
    console.error('Error classifying email:', err);
    return 'Not Interested';
  }
}

async function generateSuggestedReply(email, context) {
  try {
    const prompt = `
      You are an AI assistant helping with email responses. Here's some context:
      ${context}
      
      Here's the email you need to reply to:
      Subject: ${email.subject}
      Body: ${email.body.substring(0, 1000)}
      
      Generate a concise and professional reply. Only include the reply content, no additional text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error('Error generating suggested reply:', err);
    return 'Thank you for your email. I will get back to you soon.';
  }
}

module.exports = {
  classifyEmail,
  generateSuggestedReply,
};