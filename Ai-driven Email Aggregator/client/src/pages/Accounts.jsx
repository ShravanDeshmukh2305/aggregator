import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts, addAccount, deleteAccount } from '../store/accountSlice';
import { useEffect } from 'react';

const Accounts = () => {
  const dispatch = useDispatch();
  const { items: accounts, status, error } = useSelector(state => state.accounts);
  const [newAccount, setNewAccount] = useState({
    email: '',
    password: '',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
  });

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAccount(newAccount));
    setNewAccount({
      email: '',
      password: '',
      imapHost: 'imap.gmail.com',
      imapPort: 993,
    });
  };

  const handleDelete = (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      dispatch(deleteAccount(accountId));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Email Accounts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={newAccount.email}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={newAccount.password}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IMAP Host</label>
              <input
                type="text"
                name="imapHost"
                value={newAccount.imapHost}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">IMAP Port</label>
              <input
                type="number"
                name="imapPort"
                value={newAccount.imapPort}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Account
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
          {status === 'loading' && <p>Loading accounts...</p>}
          {status === 'failed' && <p className="text-red-500">Error: {error}</p>}
          {accounts.length === 0 ? (
            <p>No accounts added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {accounts.map(account => (
                <li key={account._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{account.email}</p>
                    <p className="text-sm text-gray-500">{account.imapHost}:{account.imapPort}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(account._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;