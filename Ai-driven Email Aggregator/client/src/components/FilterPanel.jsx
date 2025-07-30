import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../store/emailSlice';

const FilterPanel = () => {
  const dispatch = useDispatch();
  const selectedLabel = useSelector(state => state.emails.filters.label);

  const labels = [
    { value: 'Interested', color: 'bg-green-100 text-green-800' },
    { value: 'Meeting Booked', color: 'bg-blue-100 text-blue-800' },
    { value: 'Not Interested', color: 'bg-red-100 text-red-800' },
    { value: 'Spam', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Out of Office', color: 'bg-purple-100 text-purple-800' },
  ];

  const handleLabelClick = (label) => {
    dispatch(setFilter({ label: selectedLabel === label ? null : label }));
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Label</h3>
      <div className="flex flex-wrap gap-2">
        {labels.map(({ value, color }) => (
          <button
            key={value}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              selectedLabel === value ? `${color} ring-2 ring-offset-1 ring-gray-400` : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => handleLabelClick(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;