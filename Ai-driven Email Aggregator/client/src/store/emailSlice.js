import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchEmails = createAsyncThunk(
  'emails/fetchEmails',
  async ({ query, filters }, { rejectWithValue }) => {
    try {
      const params = { q: query };
      if (filters.accountId) params.accountId = filters.accountId;
      if (filters.label) params.label = filters.label;
      
      const response = await api.get('/emails/search', { params });
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchEmailDetails = createAsyncThunk(
  'emails/fetchEmailDetails',
  async ({ accountId, messageId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/emails/${accountId}/${messageId}`);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markEmailAsRead = createAsyncThunk(
  'emails/markAsRead',
  async ({ accountId, messageId }, { rejectWithValue }) => {
    try {
      await api.patch(`/emails/${accountId}/${messageId}/read`);
      return { accountId, messageId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    items: [],
    selectedEmailId: null,
    selectedEmail: null,
    searchQuery: '',
    filters: {
      accountId: null,
      label: null,
    },
    status: 'idle',
    error: null,
  },
  reducers: {
    setSelectedEmail: (state, action) => {
      state.selectedEmailId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchEmailDetails.fulfilled, (state, action) => {
        state.selectedEmail = action.payload;
      })
      .addCase(markEmailAsRead.fulfilled, (state, action) => {
        const email = state.items.find(
          e => e.accountId === action.payload.accountId && 
               e.messageId === action.payload.messageId
        );
        if (email) {
          email.isRead = true;
        }
      });
  },
});

export const { setSelectedEmail, setSearchQuery, setFilter } = emailSlice.actions;
export default emailSlice.reducer;