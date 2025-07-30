import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/dateFormatter';
import LabelBadge from './LabelBadge';
import { setSelectedEmail } from '../store/emailSlice';
import { useDispatch } from 'react-redux';

const EmailList = ({ emails, onEmailSelect }) => {
  const dispatch = useDispatch();
  const selectedEmailId = useSelector(state => state.emails.selectedEmailId);
  const searchQuery = useSelector(state => state.emails.searchQuery);

  const highlightSearchTerm = (text) => {
    if (!searchQuery || !text) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  return (
    <div className="border-r border-gray-200 h-full overflow-y-auto">
      {emails.map(email => (
        <div
          key={`${email.accountId}_${email.messageId}`}
          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
            selectedEmailId === `${email.accountId}_${email.messageId}` ? 'bg-blue-50' : ''
          }`}
          onClick={() => {
            dispatch(setSelectedEmail(`${email.accountId}_${email.messageId}`));
            onEmailSelect(email);
          }}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">
              {highlightSearchTerm(email.from)}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDate(email.date)}
            </span>
          </div>
          <p className="text-sm font-medium mt-1">
            {highlightSearchTerm(email.subject)}
          </p>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {highlightSearchTerm(email.body.substring(0, 100))}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {email.labels.map(label => (
              <LabelBadge key={label} label={label} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;