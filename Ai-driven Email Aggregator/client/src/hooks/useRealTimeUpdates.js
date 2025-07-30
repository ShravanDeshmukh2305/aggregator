import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmails } from '../store/emailSlice';

const useRealTimeUpdates = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.emails.searchQuery);
  const filters = useSelector(state => state.emails.filters);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchEmails({ query: searchQuery, filters }));
    }, 30000); 

    return () => clearInterval(interval);
  }, [dispatch, searchQuery, filters]);
};

export default useRealTimeUpdates;