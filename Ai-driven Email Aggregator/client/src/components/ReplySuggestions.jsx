import React, { useState, useEffect } from 'react';
import { getSuggestedReply } from '../services/emailService';
import { useSelector } from 'react-redux';

const ReplySuggestions = ({ email }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const accounts = useSelector(state => state.accounts.items);

  useEffect(() => {
    if (email) {
      const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getSuggestedReply(email.accountId, email.messageId);
          setSuggestions([response]);
        } catch (err) {
          setError('Failed to load suggestions');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }
  }, [email]);

  if (!email) return null;

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Suggested Replies</h3>
      
      {loading && <p className="text-sm text-gray-500">Loading suggestions...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{suggestion}</p>
            <button
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => navigator.clipboard.writeText(suggestion)}
            >
              Copy to Clipboard
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReplySuggestions;