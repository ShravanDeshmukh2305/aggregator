import api from './api';

export const searchEmails = async (query, filters = {}) => {
  const params = { q: query };
  if (filters.accountId) params.accountId = filters.accountId;
  if (filters.label) params.label = filters.label;
  
  return api.get('/emails/search', { params });
};

export const getEmailDetails = async (accountId, messageId) => {
  return api.get(`/emails/${accountId}/${messageId}`);
};

export const markEmailAsRead = async (accountId, messageId) => {
  return api.patch(`/emails/${accountId}/${messageId}/read`);
};

export const getSuggestedReply = async (accountId, messageId) => {
  return api.get(`/ai/reply/${accountId}/${messageId}`);
};