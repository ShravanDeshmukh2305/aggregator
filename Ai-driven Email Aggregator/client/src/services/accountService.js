import api from './api';

export const fetchAccounts = async () => {
  return api.get('/accounts');
};

export const addAccount = async (accountData) => {
  return api.post('/accounts', accountData);
};

export const deleteAccount = async (accountId) => {
  return api.delete(`/accounts/${accountId}`);
};