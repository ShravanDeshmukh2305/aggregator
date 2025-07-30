import React from 'react';

const labelColors = {
  'Interested': 'bg-green-100 text-green-800',
  'Meeting Booked': 'bg-blue-100 text-blue-800',
  'Not Interested': 'bg-red-100 text-red-800',
  'Spam': 'bg-yellow-100 text-yellow-800',
  'Out of Office': 'bg-purple-100 text-purple-800',
};

const LabelBadge = ({ label }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${labelColors[label] || 'bg-gray-100 text-gray-800'}`}>
      {label}
    </span>
  );
};

export default LabelBadge;