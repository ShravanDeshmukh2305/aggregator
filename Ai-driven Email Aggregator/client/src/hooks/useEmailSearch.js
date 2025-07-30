import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmails } from '../store/emailSlice';
import { debounce } from '../utils/dateFormatter';

const useEmailSearch = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.emails.searchQuery);
  const filters = useSelector(state => state.emails.filters);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      dispatch(fetchEmails({ query: searchQuery, filters }));
    }, 300);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [dispatch, searchQuery, filters]);
};

export default useEmailSearch;