require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectToElasticsearch } = require('./utils/elasticsearch');
const accountRoutes = require('./routes/accountRoutes');
const emailRoutes = require('./routes/emailRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/auth');
const imapService = require('./services/imapService');
const config = require('./config/config');
const logger = require('./utils/logger');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

connectToElasticsearch().catch(err => {
  logger.error('Elasticsearch connection error:', err);
});

app.use('/api/auth', authRoutes);          
app.use('/api/accounts', accountRoutes);   
app.use('/api/emails', emailRoutes);       
app.use('/api/ai', aiRoutes);              

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});


if (process.env.NODE_ENV !== 'test') {
  imapService.startWatchingAccounts()
    .then(() => logger.info('IMAP watchers started successfully'))
    .catch(err => logger.error('Failed to start IMAP watchers:', err));
}

module.exports = app;