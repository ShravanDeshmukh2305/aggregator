import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/emailSlice';
import { debounce } from '../utils/dateFormatter';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(() => debounce(
    (searchTerm) => dispatch(setSearchQuery(searchTerm)),
    300
  ), [dispatch]);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return (
    <div className="mb-4">
      <label htmlFor="search" className="sr-only">Search emails</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          id="search"
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search emails..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;