import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './emailSlice';
import accountReducer from './accountSlice';

export const store = configureStore({
  reducer: {
    emails: emailReducer,
    accounts: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


