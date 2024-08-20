// src/redux/UserStore.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default: localStorage
import userReducer from './UserSlice';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

// Wrap the userReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  // Configure middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific actions or paths if necessary
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/REGISTER',
        ],
        ignoredPaths: ['persistedReducer.someNonSerializablePath'],
      },
    }),
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
