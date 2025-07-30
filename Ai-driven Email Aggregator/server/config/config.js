require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/reachinbox',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here',
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL
  }
};