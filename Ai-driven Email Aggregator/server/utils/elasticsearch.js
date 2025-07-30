const { client } = require('../services/elasticsearchService');

async function connectToElasticsearch() {
  try {
    await client.ping();
    console.log('Connected to Elasticsearch');
    await createEmailIndex();
  } catch (err) {
    console.error('Elasticsearch connection error:', err);
  }
}

module.exports = {
  connectToElasticsearch,
};