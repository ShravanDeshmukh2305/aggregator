import React, { useState } from 'react';
import { formatDate } from '../utils/dateFormatter';
import LabelBadge from './LabelBadge';
import ReplySuggestions from './ReplySuggestions';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { markEmailAsRead } from '../store/emailSlice';

const EmailDetail = ({ email }) => {
  const dispatch = useDispatch();
  const [replyContent, setReplyContent] = useState('');
  const accounts = useSelector(state => state.accounts.items);
  
  if (!email) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select an email to view</p>
      </div>
    );
  }

  const account = accounts.find(a => a._id === email.accountId);
  
  React.useEffect(() => {
    if (email && !email.isRead) {
      dispatch(markEmailAsRead({
        accountId: email.accountId,
        messageId: email.messageId
      }));
    }
  }, [email, dispatch]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{email.subject}</h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">
              From: <span className="text-gray-900">{email.from}</span>
            </p>
            <p className="text-sm text-gray-500">
              To: <span className="text-gray-900">{email.to}</span>
            </p>
            <p className="text-sm text-gray-500">
              Date: <span className="text-gray-900">{formatDate(email.date)}</span>
            </p>
            {account && (
              <p className="text-sm text-gray-500">
                Account: <span className="text-gray-900">{account.email}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {email.labels.map(label => (
              <LabelBadge key={label} label={label} />
            ))}
          </div>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        <pre className="whitespace-pre-wrap font-sans">{email.body}</pre>
      </div>

      <ReplySuggestions email={email} />

      <div className="mt-8 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Reply</h3>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Type your reply here..."
        />
        <button
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => alert('Reply sent!')}
        >
          Send Reply
        </button>
      </div>
    </div>
  );
};

export default EmailDetail;