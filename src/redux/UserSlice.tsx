import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/common'; // Adjust the import path as needed

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    }
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
