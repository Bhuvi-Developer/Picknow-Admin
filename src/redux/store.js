import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from './slices/vendorSlice';

export const store = configureStore({
  reducer: {
    vendors: vendorReducer,
    // Add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 