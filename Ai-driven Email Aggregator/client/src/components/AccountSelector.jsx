import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../store/emailSlice';

const AccountSelector = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(state => state.accounts.items);
  const selectedAccountId = useSelector(state => state.emails.filters.accountId);

  const handleAccountChange = (e) => {
    dispatch(setFilter({ accountId: e.target.value || null }));
  };

  return (
    <div className="mb-4">
      <label htmlFor="account-select" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Account
      </label>
      <select
        id="account-select"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={selectedAccountId || ''}
        onChange={handleAccountChange}
      >
        <option value="">All Accounts</option>
        {accounts.map(account => (
          <option key={account._id} value={account._id}>
            {account.email}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccountSelector;