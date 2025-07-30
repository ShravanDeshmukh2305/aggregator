const { Client } = require('@elastic/elasticsearch');
const config = require('../config/config');

const client = new Client({ node: config.elasticsearch.url });

async function createEmailIndex() {
  try {
    const indexExists = await client.indices.exists({ index: 'emails' });
    if (!indexExists) {
      await client.indices.create({
        index: 'emails',
        body: {
          mappings: {
            properties: {
              accountId: { type: 'keyword' },
              messageId: { type: 'keyword' },
              from: { type: 'text' },
              to: { type: 'text' },
              subject: { type: 'text', analyzer: 'english' },
              body: { type: 'text', analyzer: 'english' },
              date: { type: 'date' },
              labels: { type: 'keyword' },
              isRead: { type: 'boolean' },
            }
          }
        }
      });
      console.log('Created Elasticsearch index');
    }
  } catch (err) {
    console.error('Error creating Elasticsearch index:', err);
  }
}

async function indexEmail(email) {
  try {
    await client.index({
      index: 'emails',
      id: `${email.accountId}_${email.messageId}`,
      body: {
        accountId: email.accountId,
        messageId: email.messageId,
        from: email.from,
        to: email.to,
        subject: email.subject,
        body: email.body,
        date: email.date,
        labels: email.labels,
        isRead: email.isRead,
      }
    });
    await client.indices.refresh({ index: 'emails' });
  } catch (err) {
    console.error('Error indexing email:', err);
  }
}

async function searchEmails(query, filters = {}) {
  try {
    const mustClauses = [];
    
    if (query) {
      mustClauses.push({
        multi_match: {
          query,
          fields: ['subject^3', 'body', 'from', 'to'],
          fuzziness: 'AUTO'
        }
      });
    }
    
    if (filters.accountId) {
      mustClauses.push({ term: { accountId: filters.accountId } });
    }
    
    if (filters.label) {
      mustClauses.push({ term: { labels: filters.label } });
    }
    
    const { body } = await client.search({
      index: 'emails',
      body: {
        query: {
          bool: {
            must: mustClauses
          }
        },
        sort: [{ date: { order: 'desc' } }],
        size: 50
      }
    });
    
    return body.hits.hits.map(hit => hit._source);
  } catch (err) {
    console.error('Error searching emails:', err);
    return [];
  }
}

module.exports = {
  client,
  createEmailIndex,
  indexEmail,
  searchEmails,
};