import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: true, 
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppState(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setAppState } = appSlice.actions;
export default appSlice.reducer;
