// src/redux/slices/themeSlice.ts
import { createSlice } from '@reduxjs/toolkit'; // adjust path if needed
import DarkTheme from '../Utils/Themes/DarkTheme';
import LightTheme from '../Utils/Themes/LightTheme';


const initialState = {
  isDark: false,
  theme: LightTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      state.theme = state.isDark ? DarkTheme : LightTheme;
    },
     setTheme: (state, action) => {
      state.isDark = action.payload === 'dark';
      state.theme = state.isDark ? DarkTheme : LightTheme;
    },
    
  },
});

export const { toggleTheme,setTheme } = themeSlice.actions;
export default themeSlice.reducer;
