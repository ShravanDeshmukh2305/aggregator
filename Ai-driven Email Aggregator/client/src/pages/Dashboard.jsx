import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmails } from '../store/emailSlice';
import EmailList from '../components/EmailList';
import EmailDetail from '../components/EmailDetail';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import AccountSelector from '../components/AccountSelector';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: emails, status, error } = useSelector(state => state.emails);
  const searchQuery = useSelector(state => state.emails.searchQuery);
  const filters = useSelector(state => state.emails.filters);

  useRealTimeUpdates();

  useEffect(() => {
    dispatch(fetchEmails({ query: searchQuery, filters }));
  }, [dispatch, searchQuery, filters]);

  const [selectedEmail, setSelectedEmail] = React.useState(null);

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
  };

  return (
    <div className="flex h-full">
      <div className="w-1/3 flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <SearchBar />
          <AccountSelector />
          <FilterPanel />
        </div>
        {status === 'loading' && <div className="p-4 text-center">Loading emails...</div>}
        {status === 'failed' && <div className="p-4 text-red-500">Error: {error}</div>}
        {status === 'succeeded' && (
          <EmailList emails={emails} onEmailSelect={handleEmailSelect} />
        )}
      </div>
      <div className="w-2/3">
        <EmailDetail email={selectedEmail} />
      </div>
    </div>
  );
};

export default Dashboard;